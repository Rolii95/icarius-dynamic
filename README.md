# Icarius Dynamic

## Blog RSS feed

Subscribe to the blog updates by visiting the RSS feed at `/blog/rss`. For example, if your site is hosted at `https://example.com`, the feed is available at `https://example.com/blog/rss`.

## Environment variables

Configure the following environment variables for both local development and production deployments:

| Variable | Description |
| --- | --- |
| `MAILJET_API_KEY` | Mailjet API key used for authenticating requests. |
| `MAILJET_API_SECRET` | Mailjet API secret paired with the API key for authentication. |
| `MAILJET_LIST_ID` | Identifier of the Mailjet contact list that receives newsletter subscriptions. |
| `NEXT_PUBLIC_FEATURE_CHATBOT_DRAG` | Enable the draggable chatbot experiment (`true` to enable the handle). |

## Chatbot drag feature toggles

- Set `NEXT_PUBLIC_FEATURE_CHATBOT_DRAG=true` to render the draggable handle in local development or preview builds.
- Override behaviour at runtime for QA by running `localStorage.setItem('icarius:chat:drag', 'true')` or `'false'` in the browser console. This value takes precedence over the environment flag.
- The widget stores its last position in `localStorage` under the key `icarius:chat:pos`. Clear that key to reset the placement back to the default corner.
