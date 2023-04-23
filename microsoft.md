# 🪟 Signing in users with Microsoft

This how-to assumes you've already enabled Identity Platform,
and have a basic knowledge.
Please see the [GitHub](./github) tutorial to learn how.

The most important steps are...

## Register an application

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select Azure Active Directory.
1. Under Manage, select App registrations -> New registration.
  ![Screenshot: App registration](./img/azure-ad-new-app.png)
1. Enter a display Name and as redirect URI your Firebase URL.
  ![Screenshot: Regsiter an application](./img/azure-ad-new-app-config.png)
1. Select Register to complete the initial app registration.
1. When registration finishes, the Azure portal displays the app registration's Overview pane. You see the Application (client) ID.
  ![Screenshot: verview pane](./img/azure-ad-new-app-id.png)
    1. Copy the application (client) ID.
    1. Add a new client secret.
1. Create a new client secret.
  ![Screenshot: Certificates & secrets](./img/azure-ad-new-app-secret.png)
1. Enter a description and choose an expiration date.
  ![Screenshot: Certificates & secrets](./img/azure-ad-new-app-secret-config.png)
1. Copy the value of the application (client) secret.
  ![Screenshot: Certificates & secrets](./img/azure-ad-new-app-secret-copy.png)

## Create Microsoft provider

1. Go to the Identity Platform page in the Google Cloud console and create a new provider (Microsoft). Paste App ID and App Secret.
  ![Screenshot: Credentials](./img/google-cloud-microsoft-provider.png)