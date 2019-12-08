# sharky-ui-api

sharky test net UI API

## Setup env for build and deploy

1. Install [GCP SDK](https://cloud.google.com/sdk/install)
2. Install [Helm](https://github.com/helm/helm/releases)
3. Initialize `gcloud`:
```
gcloud init
```
4. Configure `gcloud`:
```
gcloud config set core/project sharky-259408
gcloud config set compute/region us-central1-a
gcloud config set compute/zone us-central1-a
gcloud container clusters get-credentials sharky
```
5. Authorize local Docker for pushing to [GCR](https://cloud.google.com/container-registry/):
```
gcloud auth configure-docker
```
6. Whitelist your IP for working with cluster [instructions](https://cloud.google.com/kubernetes-engine/docs/how-to/authorized-networks).
7. Install `kubectl`:
```
gcloud components install kubectl

```
8. Check that you can use `kubectl` to talk to the cluster:
```
kubectl get nodes
```

## Build

Update deployment version (increment the number) in file [build-push.sh](build-push.sh):

```
VERSION="00017"
```

Then run the script `build-push.sh`. This will build a local Docker image of the application, properly tag it, and push it to a proper place in GCR.

## Deploy

Deploy scripts are found in the repository [sharky-test-net/sharky-k8s](https://github.com/sharky-test-net/sharky-k8s). In a separate terminal window, clone this repo, and switch to the root of it. So that you can directly execute shell scripts in this folder (for example `deploy-sharky-ui-api.sh`)

Update deployment version (increment the number) in file [deploy-sharky-ui-api.sh](https://github.com/sharky-test-net/sharky-k8s/blob/master/deploy-sharky-ui-api.sh):
```
VERSION="00017"
```

Then run the script `deploy-sharky-ui-api.sh`. This will use Helm to deploy a new version of the application to the cluster. It will use the Docker image found in the GCR to update running pods.
