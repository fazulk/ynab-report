<template>
  <div class="counter">
    <p>Checking Balance (not including pending transactions): <span :class="(currentCheckingBalance < 300 || leftOverBalance < 300) && 'negative'"><strong>{{ currentCheckingBalance }}</strong></span></p>
    <p>Savings Balance: <span :class="(savingsBalance < 300) && 'negative'"><strong>{{ savingsBalance }}</strong></span></p>

    <template v-if="scheduledExpenses.length">
      <h4>Upcoming expenses (next 14 days): <strong class="negative">{{ expensesTotal }}</strong> </h4>
      <ul>
        <li v-for="(s, i) in scheduledExpenses" :key="i">
          {{ s.date }} {{ s.payee }} <span class="negative">{{ s.amount }}</span> <i v-if="s.memo">({{ s.memo }})</i>
        </li>
      </ul>
    </template>

    <!-- <h4>
      Projected balance: <span :class="leftOverBalance < 300 && 'negative'">{{ leftOverBalance }}</span>
    </h4> -->
    <template v-if="scheduledIncome.length">
      <h4>Projected income 💰 (next 14 days): <strong class="positive">{{ incomeTotal }}</strong> </h4>
      <ul>
        <li v-for="(s, i) in scheduledIncome" :key="i">
          {{ s.date }} {{ s.payee }} <strong class="positive">{{ s.amount }}</strong> <i>{{ s.memo }}</i>
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts" setup>
import ynab from 'ynab'

const accessToken = import.meta.env.YNAB_TOKEN
const ynabAPI = new ynab.API(accessToken)
const checking = await ynabAPI.accounts.getAccountById(
  'last-used',
  'zzz-your-ynab-checking-acct',
)

const checkingBalance = checking.data.account.balance

function roundNumber(number) {
  return Math.round(Number((number / 100).toFixed(2)))
}

const currentCheckingBalance = roundNumber(
  Math.floor(checkingBalance / 10),
)

function addDays(days) {
  const result = new Date()
  result.setDate(result.getDate() + days)
  return result
}

const { data: { scheduled_transactions } } = await ynabAPI.scheduledTransactions.getScheduledTransactions(
  'last-used',
)

const scheduledTransactions = scheduled_transactions
  .filter(t => t.account_name === 'Checking')
  .filter((t) => {
    return (new Date(t.date_next).getTime() - addDays(14).getTime()) < 0
  }).map((t) => {
    return {
      amount: roundNumber(Math.floor(t.amount / 10)),
      date: t.date_next,
      payee: t.payee_name,
      memo: t.memo || '',
    }
  }).sort((a, b) => Number(new Date(a.date)) - Number(new Date(b.date)))

const scheduledExpenses = scheduledTransactions.filter(t => t.amount < 0)

const expensesTotal = scheduledExpenses.reduce((prev, curr) => {
  return prev + curr.amount
}, 0)

const scheduledIncome = scheduledTransactions.filter(t => t.amount > 0)

const incomeTotal = scheduledIncome.reduce((prev, curr) => {
  return prev + curr.amount
}, 0)

const savings = await ynabAPI.accounts.getAccountById(
  'last-used',
  'zzz-your-ynab-savings-acct-id',
)

const savingsBalance = roundNumber(
  Math.floor(savings.data.account.balance / 10),
)

const leftOverBalance = roundNumber(
  Math.floor(checkingBalance / 10) + expensesTotal,
)

</script>
