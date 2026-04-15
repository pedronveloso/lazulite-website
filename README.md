# Source code for Lazulite Android App website

Website live at: https://lazulite.app

## Development

**Prerequisites:** Hugo extended v0.101.0+ (Netlify pins to 0.101.0; local newer versions work fine)

```bash
# Start local dev server with live reload
hugo server

# Include draft content
hugo server -D

# Production build (outputs to public/)
hugo
```

The dev server runs at http://localhost:1313 by default.

## Testing

E2E tests use Cypress with the site running on port 8888:

```bash
# Start Hugo on the expected port first
hugo server --port 8888

# Then in a separate terminal
cypress open   # interactive
cypress run    # headless
```

## Deployment

Netlify deploys automatically on push to `main`. Hugo version and build command are configured in `netlify.toml`.

