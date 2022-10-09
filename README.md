# YNAB Report

Steps:

1. Setup Sengrid Account and get API key
2. Get YNAB API Key
3. Create a new .env file in root of project with following keys/your values:

    ```javascript
    YNAB_TOKEN= <ynab token>
    SENDGRID_API_KEY= <sengrid api key>
    SENGRID_EMAIL=<email for your sengrid acct>
    NODE_ENV=development
    EMAIL=<receipt email>
    ```

4. Update YnabReport.vue with your account ids
5. Run `npm install`
6. Run `npm run dev` to work on how your report looks
7. Run `npm run send` to send the report to your email
8. When ready you can run report by running the github actions manual workflow, but do below first:
    1. Add `YNAB_TOKEN` and `SENDGRID_API_KEY` to your github actions secrets
    2. Open up .github/workflows/email.yaml  
    - Update the defaults for the github action
