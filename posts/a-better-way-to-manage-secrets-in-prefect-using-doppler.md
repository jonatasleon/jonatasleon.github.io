---
title: A Better Way to Manage Secrets in Prefect Using Doppler
date: 2025-12-22 22:30:00
excerpt: A better way to manage secrets in Prefect using Doppler
---

Recently I came across [Doppler](https://doppler.com/) and I wanted to share a specific use case for it.

I'm currently spending some time on a side project where I'm using [Prefect](https://www.prefect.io/) to manage my workflows. Despite the fact that I'm not using Prefect in production, I still want to be able to manage my secrets in a secure way and Prefect manages secrets using [blocks](https://docs.prefect.io/v3/concepts/blocks) which I'm not a fan of.

## Why not Prefect Secret blocks directly?

- No environment parity between local and cloud
- Secrets tightly coupled to Prefect runtime
- Harder to share secrets across non-Prefect services

That's where Doppler comes in.

## TLDR

If you already use Prefect and Doppler, skip directly to [The code](#the-code) for the implementation.

## Doppler

Doppler is a centralized secret manager that syncs environment-specific secrets to applications via environment variables, SDKs, or CLI, with built-in support for access control, rotation, and multiple deployment environments.

### Setting up Doppler account

To start using Doppler, it's necessary to create an [account](https://dashboard.doppler.com/register). This setup is pretty straightforward and I recommend to follow the [official documentation](https://docs.doppler.com/docs/getting-started) to complete it.
Note that you don't need to provide credit card information to start using the service.

### Setting up a project

1. For this example, I'll create a project called `my-project`:

   ![Creating a project](/SCR-20251222-qufz.png)

2. As soon as we create the project, Doppler automatically creates three environments and their slugs: **Development**(`dev`), **Staging**(`stg`) and **Production**(`prd`).

   ![Created environments](/SCR-20251222-qvxj.png)

3. Let's define a secret called `SECRET_API_KEY` and we'll set the value to `1234567890`. After entering the value, click the Save button.

   ![Creating a secret](/SCR-20251222-qxhf.png)

4. After saving, Doppler will ask whether you want to propagate this secret. You can choose to propagate it to all environments or just to the selected ones.

   ![Spreading secrets](/SCR-20251222-qxyi.png)

### Setting up an access token

We also need to create an access token to be able to retrieve the secrets from the project.

1. On the Doppler dashboard, select the project and click on "Access", then click on "Generate":

   ![Generate access token](/SCR-20251222-rpko.png)

2. Then enter with a name for the access token and click on "Generate", then copy the access token.

   ![Enter name for access token](/SCR-20251222-rqbu.png)

   > For security reasons, it's recommended to scope the access token for read-only.

3. For now, save the access token in a secure place. We'll need it later.

## Prefect

Prefect is a workflow management tool that allows you to manage workflows in a _pythonic_ and reliable way. I'd recommend to check the [official documentation](https://docs.prefect.io/v3/getting-started/overview/) for more information.

For simplicity, I'll assume you already have a Prefect project set up.

### Prefect blocks

Prefect blocks are a persistence mechanism for configuration and credentials, including secrets.
It gets the job done but for this example, we want to delegate the secrets management to Doppler.

In order to do that, let's create a new block called `doppler-config` to store the Doppler configuration.

In the Prefect UI, let's access the blocks section:

1. First click on "Settings" on the sidebar:

   ![Creating a new block](/SCR-20251222-rfqx.png)

2. Then click on "Blocks":

   ![Blocks section](/SCR-20251222-rjgd.png)

3. Then click on "Block +"

   ![Create block](/SCR-20251222-rjvj.png)

4. Then search for "Secret"

   ![Search for "Secret"](/SCR-20251222-rjys.png)

5. Then click on "Secret"

    ![Secret block](/SCR-20251222-rlbc.png)

6. Now we need to fill the form with the following information:
   - Name: `doppler-config`
   - Type: `JSON`
   - Value:

      ```json
      {
        "project": "my-project",
        "config": "dev",
        "access_token": "sv.*********************"
      }
      ```

      Remember to replace the `access_token` with the one you copied earlier.

   ![Fill the form](/SCR-20251222-rmib.png)

   Then click on "Create"

## The code

With the setup complete, let's look at the code.

### Requirements

Before diving into the code, we'll need to have a few things in place:

- Python 3.10+ installed
- `uv` or `pip` to install the dependencies

> Note: While using `pip` it's recommended to use a virtual environment to avoid conflicts with other projects.
>
> ```bash
> python -m venv .venv
> source .venv/bin/activate
> ```

Install the dependencies:

```bash
# Using uv
uv add doppler-sdk prefect python-dotenv pydantic pydantic-settings

# Using pip
pip install doppler-sdk prefect python-dotenv pydantic pydantic-settings
```

## Whispering our secrets to Prefect

First things first, let's create a `settings.py` file to load our configuration from environment variables.

```python
# settings.py

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    secret_api_key: str

```

Now, in `secrets.py` file, we can define the function that brings our secrets to life.

```python
# secrets.py

from io import StringIO

from dopplersdk import DopplerSDK
from dotenv import load_dotenv
from prefect.blocks.system import Secret

def load_secrets_from_doppler():
    secret_block = Secret.load("doppler-config")
    doppler_config = secret_block.get()
    doppler = DopplerSDK(access_token=doppler_config["access_token"])
    response = doppler.secrets.download(
        config=doppler_config["config"],
        project=doppler_config["project"],
        format="env",
    )
    stream = StringIO(response.text)
    load_dotenv(stream=stream)
```

This function performs the following steps:

1. First, we load the secret block from Prefect and get the configuration.

   ```python
   secret_block = Secret.load("doppler-config")
   doppler_config = secret_block.get()
   ```

2. Then we initialize the Doppler SDK with the access token.

   ```python
   doppler = DopplerSDK(access_token=doppler_config["access_token"])
   ```

3. Then we download the secrets from Doppler with `.env` format and save it in a string buffer.

   ```python
   response = doppler.secrets.download(
       config=doppler_config["config"],
       project=doppler_config["project"],
       format="env",
   )
   stream = StringIO(response.text)
   ```

4. Finally we load the environment variables from the string buffer.

   ```python
   load_dotenv(stream=stream)
   ```

Until now, we have the secrets loaded into the environment variables. Let's see how to use them in our flow.

### Loading the secrets in our flow

Now we can load the secrets in our flow.

```python
# my_flow.py

from prefect import flow

from .secrets import load_secrets_from_doppler
from .settings import Settings


@flow
def my_flow():
    load_secrets_from_doppler()
    settings = Settings()
    print(settings.secret_api_key)


if __name__ == "__main__":
    my_flow()
```

1. First we load the the secrets from Doppler into the environment variables.

   ```python
   load_secrets_from_doppler()
   ```

2. Then we load the settings from the environment variables using the `Settings` class.

   ```python
   settings = Settings()
   ```

   It's mandatory to load the secrets into environment variables before instantiating the `Settings` class.

3. Finally we print the secret API key using the `settings` object.

   ```python
   print(settings.secret_api_key)
   ```

Now let's run the flow.

```bash
# Using uv
uv run python my_flow.py

# Using pip with virtual environment
python my_flow.py
```

We should see the secret API key printed in the console:

```text
prefect.engine - View at https://app.prefect.cloud/account/24a1d5dd-fc9f-4a8e-a812-42e5648ba921/workspace/5495293d-ab61-4b84-9ad7-84c2d203ce73/runs/flow-run/06949dca-954e-7189-8000-d8b048e75ad8
Flow run 'amaranth-caterpillar' - Beginning flow run 'amaranth-caterpillar' for flow 'my-flow'
Flow run 'amaranth-caterpillar' - View at https://app.prefect.cloud/account/24a1d5dd-fc9f-4a8e-a812-42e5648ba921/workspace/5495293d-ab61-4b84-9ad7-84c2d203ce73/runs/flow-run/06949dca-954e-7189-8000-d8b048e75ad8
0123456789
Flow run 'amaranth-caterpillar' - Finished in state Completed()
```

That's it! We have the secrets loaded into the environment variables and we can use them in our flow.

> Note that even we are running the flow locally, if the prefect profile is set to run in the cloud, the flow will load the block from the cloud.

## Conclusion

In this post, we saw how to use Doppler to manage secrets in Prefect. We created a new block in Prefect to store the Doppler configuration and we loaded the secrets from Doppler into the environment variables. Finally we saw how to use the secrets in our flow.

I hope you found this post helpful. If you have any questions, feel free to reach out to me on [LinkedIn](https://www.linkedin.com/in/jonatasleon/).
