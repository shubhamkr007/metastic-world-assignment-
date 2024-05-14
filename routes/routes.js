import express from 'express';
import User from '../models/User.js'

const router = express.Router();
const arr = [1,0.5,0.4,0.2,0.1,0.05];

const recursiveFunction = async(ind,id,amount)=>{
    if(ind == 6){
        return;
    }
    const user = await User.findOne({_id:id})
    let newAmount = user.Amount + amount*arr[ind];
    await User.updateOne({_id:id},{$set:{Amount:newAmount}})
    await user.save();
    for(let i=0;i<user.Childrens.length;i++){
        await recursiveFunction(ind+1,user.Childrens[i],amount);
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - Name
 *         - Amount
 *       properties:
 *         Name:
 *           type: string
 *           description: The name of the user
 *         Amount:
 *           type: number
 *           description: User amount
 *         Childrens:
 *           type: array
 *           items:
 *              type: string
 *           description: The user children
 *       example:
 *         Name: shubham
 *         Amount: 100
 *         Childrens: []
 *     UpdateData:
 *       type: object
 *       required:
 *         - Amount
 *       properties:
 *         Amount:
 *           type: number
 *           description: User amount
 *       example:
 *         Amount: 100
 */

 /**
  * @swagger
  * tags:
  *   name: Users
  *   description: The Multi-level Marketing API
  */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all Users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Users'
 */

router.get("/", async (req, res) => {
    try {
        const  users = await User.find();
        res.send(users);
    } catch (error) {
        console.log(error)
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get the user data by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user data by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       404:
 *         description: The user was not found
 */

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id.toString();
        const user = await User.findOne({_id:id})
        res.send(user);
    } catch (error) {
        console.log(error)
    }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       200:
 *         description: The User was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       500:
 *         description: Some server error
 */

router.post("/", async (req, res) => {
	try {
        const {Name,Amount,Childrens} = req.body;
        const newUser = new User({
            Amount,
            Childrens,
            Name
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.log(error);
    }
});

/**
 * @swagger
 * /users/{id}:
 *  put:
 *    summary: Add amount to user by the id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The User id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UpdateData'
 *    responses:
 *      200:
 *        description: The User was updated
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id",async (req, res) => {
	try {
        const id = req.params.id;
        await recursiveFunction(0,id,req.body.Amount);
		res.send("Amount Added to User and Childrens");
	} catch (error) {
		return res.status(500).send(error);
	}
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 * 
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 */

router.delete("/:id", async (req, res) => {
    try {

        const id = req.params.id;
        await User.deleteOne({_id:id});
        res.send("User Deleted !");
    }catch(err){
        console.log(err);
    }

});

export default router;