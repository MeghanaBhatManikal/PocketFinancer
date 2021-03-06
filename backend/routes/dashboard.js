const express = require("express");
const router = express.Router();
const data = require("../data");
var _ = require('lodash');
const budgetData = data.budget;
const expenseData = data.expense;


router.get("/:id", async (req, res) => {
    try {
      const expenseList = await expenseData.getUserAllExpenses(req.params.id);
       const budgetList = await budgetData.getUserAllBudgets(req.params.id);
        const today = new Date();
      const expensesMonth = expenseList.filter(expense =>{
          const date = expense.date
          const dateArr = date.split("-");

          if(dateArr[0] === today.getFullYear().toString() && dateArr[1] === (today.getMonth() + 1).toString()){
              return true;
          }else{
              return false;
          }
      })
     const expensesByCateogory =  _.groupBy(expensesMonth, "category");


     let categoryExpenseList = 
     Object.keys(expensesByCateogory).map(element => {

         const amount = expensesByCateogory[element].reduce(
            function (acc, obj) { return acc + obj.amount; }, 0
         )

         const budget = budgetList.find( budget => budget.category === element)
         let budgetAmount = 0;
         if( budget && budget.amount ){
             budgetAmount = budget.amount;
         }
         return {
             amount: amount,
             category: element,
             budgetAmount: budgetAmount
         };

     });
      if(categoryExpenseList){
        res.json(categoryExpenseList);
      }else{
          res.send("No expense data exists")
      }
      
    } catch (e) {
      // Something went wrong with the server!
      res.status(500).send({ error: e });
    }
  });
  module.exports = router;