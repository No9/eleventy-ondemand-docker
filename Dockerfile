FROM public.ecr.aws/lambda/nodejs:14
COPY knative ./knative
COPY knative/functions/ondemand ./
COPY package*.json ./
RUN npm install
CMD [ "index.handler" ]