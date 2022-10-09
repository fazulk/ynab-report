# YNAB Report

Steps:

1. Setup Sengrid Account and get API key
2. Get YNAB API Key
3. Create a new .env file in root of project with following keys/your values:

    ```javascript
    YNAB_TOKEN= <also add to github actions secrets>
    SENDGRID_API_KEY= <also add to github actions secrets>
    SENGRID_EMAIL=<email for your sengrid acct>
    NODE_ENV=development
    EMAIL=<receipt email>
    ```

4. Open up .github/workflows/email.yaml  
    - Update the defaults for the github action
5. Update YnabReport.vue with your account ids
6. Run `npm install`
7. Run `npm run dev` to work on how your report looks
8. Run `npm run send` to send the report to your email
9. When ready you can run report by running the github actions manual workflow
