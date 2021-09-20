# Astro Object DB API

The Astro Object DB is the EDC database that houses astronomical data for EPO web apps. The Data Access Protocol (DAC) for the Astro Object DB is this graphQL endpoint.

## Endpoint

https://us-central1-skyviewer.cloudfunctions.net/astro-objects-api 

## API

This is a graphQL endpoint. 

```gql
{
    astroObjects(id: <objectID>) {
        id        
        _RA        
        _DEC        
        _score        
        type        
        distance        
        brightness        
        img        
        position    
    }
} 
```

## Deployment

Run the following command:

```bash
gcloud functions deploy astro-objects-api --runtime nodejs14 --trigger-http --allow-unauthenticated
```