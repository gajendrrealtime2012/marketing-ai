--------------------------- Steps for setting up locally: ----------------------------------------------------------------------------------------

step 1: Clone the code repository
step 2: RUN 'npm install'
step 4: configure the project with google service account json files for vertexai service account(marketing-ai-445804-08fdf5f6aa4a.json) and for firestore service account(marketingai-db-firestore-service-account.json) in the main project root directory
step 5: Set the env varaibles in .env variables and set the tuned model in config/vertexAITunedConfig.ts file
step 6: RUN 'npm run build'
step 7: RUN 'npm run start'

---------------- Instructions to set up Google Project: ------------------------------------------------------------------------------------------------------------

step 1: Create a google project first and then install the Google cloud SDK on your machine then configure it with command line interface
eg: gcloud config set project <your-project-id>

step 2: Enable Required APIs:

gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

step 3: GCP Model Configuration:

Deploy gemini-1.5-pro-002 from Vertexai model garden and configure it with NodeJs Project

For Fine Tunning Deploy your custom Tuned Model with Base Model as gemini-1.5-pro-002 and feed domain specefic datasets(eg. marketing) (prepare jsonl file with input prompt and AI generated output content )

Configure both models in NodeJs Project in config directory

step 4: Docker Configuration:

docker build -t gcr.io/<your-project-id>/youe-image-name:latest .
docker run -p 8080:8080 --env-file .env gcr.io/<your-project-id>/youe-image-name:latest

after testing locally, you can push the image on the goolecloud

docker push gcr.io/<your-project-id>/youe-image-name:latest

eg.

docker build -t gcr.io/marketing-ai-445804/marketing-ai-web-app:latest .

docker run -p 8080:8080 --env-file .env gcr.io/marketing-ai-445804/marketing-ai-web-app:latest

docker push gcr.io/marketing-ai-445804/marketing-ai-web-app:latest

-------------------------- Required environment variables: -------------------------------------------------------------------------------------------
PORT=8080
GCP_PROJECT_ID=
GCP_LOCATION=
GCP_PROJECT=
GOOGLE_APPLICATION_CREDENTIALS=
GCP_TUNED_MODEL_PROJECT_ID=
GCP_TUNED_MODEL_LOCATION=
GCP_TUNED_MODEL=

---------------- Deployment on Google Cloud Run Using Pulumi(IAC): ------------------------------------------------------------------------------------------------------------

step 1: Install Pulumi SDK

step 2: Clone the Repo

step 3: Authenticate with your GCP account
eg gcloud auth login

step 4: gcloud config set project <PROJECT_ID>

step 5: RUN npm install

step 6: add the .env file in root directory

step 7: RUN pulumi up

step 8: create your pulumi stack
