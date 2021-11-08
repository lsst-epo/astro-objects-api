# Astro Object DB API

The Astro Object DB is the EDC database that houses astronomical data for EPO web apps. The Data Access Protocol (DAC) for the Astro Object DB is this graphQL endpoint.

## Endpoint

https://us-central1-skyviewer.cloudfunctions.net/astro-objects-api 

## API

This is a graphQL endpoint. The `astroObjects` schema accepts a single argument as a float (with no quotes).

```gql
{
    astroObjects(objectId: <objectID>) {
        id        
        ra        
        dec                
        type        
        distance        
        brightness        
        objectId
        sourceId   
    }
} 
```

## Deployment

Run the following command:

```bash
gcloud functions deploy astro-objects-api --runtime nodejs14 --trigger-http --allow-unauthenticated
```

The following environment variables must also be provided in the GCP console:

* DB_USER
* DB_PASS
* DB_NAME
* DB_HOST