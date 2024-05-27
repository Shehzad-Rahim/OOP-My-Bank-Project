#! /usr/bin/env node
import inquirer from "inquirer";
import {faker} from "@faker-js/faker";
import chalk from "chalk";
//customer Class
class Customer {
    firstName: string
    lastName: string
    age: number
    gender: string
    mobNumbre: number
    accNumber: number

    constructor(fName: string, lName: string, age: number, gender: string, mob: number, acc: number) {
        this.firstName = fName
        this.lastName = lName
        this.age = age
        this.gender = gender
        this.mobNumbre = mob
        this.accNumber = acc
    }
}
// Interface BankAccount
interface BankAccount {
    accNumber:number;
    balance:number;
}

// Class Bank
class Bank{
    customer : Customer[] = [];
    account : BankAccount[] = [];

    addCustomer(obj:Customer){
        this.customer.push(obj)
    }
    addAccountNumber(obj:BankAccount){
        this.account.push(obj);

    }

    transaction(accObj:BankAccount){
        let newAccounts = this.account.filter(acc => acc.accNumber !==  accObj.accNumber);
        this.account = [...newAccounts, accObj]
    }

}

let myBank = new Bank();

// Creat Customer
for (let i:number = 1; i <= 3; i++){
    let fName = faker.person.firstName('male')
    let lName = faker.person.lastName()
    let num = parseInt(faker.phone.number('3#########'))
    const customer = new Customer(fName, lName,25*i,'male', num,1000+i) 
    myBank.addCustomer(customer)
    myBank.addAccountNumber({accNumber:customer.accNumber, balance:1000*i})
}

// console.log(myBank);

// Bank Functionality 

async function bankService(bank:Bank){
   do{
    let service = await inquirer.prompt({
        type: 'list',
        name: 'select',
        message: 'Please select the service',
        choices: ['View Balance', 'Cash Withdraw', 'Cash Deposit', 'Exit']
    });
    // View Balance 
    if(service.select == 'View Balance'){
       let response = await inquirer.prompt({
        type: 'input',
        name: 'num',
        message: 'Please enter your account number',
       });
       let account = myBank.account.find(acc => acc.accNumber == response.num)
       if(!account){
        console.log(chalk.red.bold('Invalid account number'));
       }
       if(account){
        let name = myBank.customer.find((item)=> item.accNumber == account?.accNumber);
        console.log(`Dear ${chalk.green.bold(name?.firstName)} ${chalk.green.bold(name?.lastName)} your Account balance is ${chalk.blue.bold(`$${account.balance}`)}`);
       }
    }

    // Cash Withdraw
    if(service.select == 'Cash Withdraw'){
        let response = await inquirer.prompt({
            type: 'input',
            name: 'num',
            message: 'Please enter your account number',
           });
           let account = myBank.account.find(acc => acc.accNumber == response.num)
           if(!account){
            console.log(chalk.red.bold('Invalid account number'));
           }
           if(account){
            let answer = await inquirer.prompt({
                type: 'number',
                name: 'amount',
                message: 'Please enter your amount.'
            });
            if(answer.amount > account.balance){
                console.log(chalk.red.bold('Insufficient amount'));
                
            }
            let newBlanace = account.balance - answer.amount;
            // Transaction method call
            bank.transaction({accNumber:account.accNumber, balance:newBlanace})
        

    }
}
    // cash Deposit
    if(service.select == 'Cash Deposit'){
        let response = await inquirer.prompt({
            type: 'input',
            name: 'num',
            message: 'Please enter your account number',
           });
           let account = myBank.account.find((acc) => acc.accNumber == response.num)
           if(!account){
            console.log(chalk.red.bold('Invalid account number'));
           }
           if(account){
            let answer = await inquirer.prompt({
                type: 'number',
                name: 'amount',
                message: 'Please enter your amount.'
            });
            let newBlanace = account.balance + answer.amount;
            // Transaction method call
            bank.transaction({accNumber:account.accNumber, balance:newBlanace})
           
           }
        }
        if(service.select == 'Exit'){
            return;
        }
   }
   while(true)
}

bankService(myBank);