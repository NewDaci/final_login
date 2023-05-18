import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import connectMongo from '../../../database/conn'
import Users from '../../../model/Schema'
import { compare } from 'bcryptjs';

export default NextAuth({
    providers : [
        // Google Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
        // Credentials Provider
        CredentialsProvider({
            name : "Credentials",
            async authorize(credentials, req){
                // Establish connection with MongoDB
                const connection = await connectMongo().catch(error => { error: "Connection Failed...!"});
                if (!connection) throw new Error("Could not establish connection to MongoDB");

                // Check if user exists in the database
                const result = await Users.findOne( { email : credentials.email})
                if(!result){
                    throw new Error("No user Found with Email Please Sign Up...!");
                }

                // Check if the password matches the user's password in the database
                const checkPassword = await compare(credentials.password, result.password);
                if(!checkPassword || result.email !== credentials.email){
                    throw new Error("Username or Password doesn't match");
                }

                return result;
            }
        })
    ],
    secret: "ErCHKZMeMLTQPfDXbbQhBjYf7Oq4W9Hv+XJ6IIxHqo4=",
    session: {
        strategy: 'jwt',
    }
})
