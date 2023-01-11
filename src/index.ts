import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

app.get("/accounts/:id", (req: Request, res: Response) => {

   try{
    const id = req.params.id
    const result = accounts.find((account) => account.id === id) 
 
    if(!result){
    res.status(404)
    throw new Error("Conta não existe, verifique o id")
    }
    res.status(200).send(result)
   } catch(error:any) {
    console.log(error)

    if(res.statusCode === 200){
        res.status(500)
    }
    res.send(error.message)

   }


   
    
})

// Refatorar para o uso do bloco try/catch

// Validação de input:
// Caso a id recebida não inicie com a letra ‘a’ será retornado um erro 400
// Mensagem de erro:
// 	“‘id’ inválido. Deve iniciar com letra ‘a’”

app.delete("/accounts/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id
          
        if(id[0]!== "a"){
            res.status(400)
            throw new Error(" id inválido. Deve iniciar com a letra a.");
        }

        const accountIndex = accounts.findIndex((account) => account.id === id)
    
        if (accountIndex >= 0) {
            accounts.splice(accountIndex, 1)
            res.status(200).send("Item deletado com sucesso")
        } else {
            res.status(404).send("Item não encontrado")
        }
    
        
        
    } catch (error) {
        
        console.log(error)
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)

    }
   
})

// req.body.balance (newBalance)
// Deve ser number
// Deve ser maior ou igual a zero

// req.body.type (newType)
// deve valer um dos tipos de conta do enum

app.put("/accounts/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

//         Para fixar, agora é sua vez de implementar as seguintes validações:
// req.body.id (newId)
// string que inicia com a letra ‘a’

// req.body.ownerName (newOwnerName)
// string com no mínimo 2 caracteres

    const newId = req.body.id 
    if(newId !== undefined) {
        if(newId[0] !== "a"){
            res.status(400)
            throw new Error ("A primeira letra deve ser a")
        }
    }
    const newOwnerName = req.body.ownerName 
    if(newOwnerName !== undefined){
        if (newOwnerName.length < 2){
        res.status(400)
            throw new Error ("Deve ter pelo menos dois caracteres")}
    }
    const newBalance = req.body.balance 
    if(typeof newBalance !== "number"){
        res.status(400)
        throw new Error("Balance deve ser do tipo number");
    }
    if(newBalance<0){
      res.status(400)
      throw new Error("'balance' não pode ser negativo")
    }

    //req.body.type (newType)
    // deve valer um dos tipos de conta do enum

    const newType = req.body.type 
    if(newType !== undefined){

        if(newType !== ACCOUNT_TYPE.GOLD &&
            newType !== ACCOUNT_TYPE.PLATINUM &&
            newType !== ACCOUNT_TYPE.BLACK){
                res.status(400)
                throw new Error("'type' deve ser um tipo válido: gold, platinium ou black")

        }
    }



    const account = accounts.find((account) => account.id === id) 

    if (account) {
        account.id = newId || account.id
        account.ownerName = newOwnerName || account.ownerName
        account.type = newType || account.type

        account.balance = isNaN(newBalance) ? account.balance : newBalance
    }

    res.status(200).send("Atualização realizada com sucesso")
        
    } catch (error) {
        console.log(error)
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
        
    }
    
})