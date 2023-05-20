import connectMongo from '../../../database/conn';
import Users from '../../../model/Schema';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  try {
    await connectMongo();

    // Only accept POST method
    if (req.method === 'POST') {
      if (!req.body) {
        return res.status(404).json({ error: "Don't have form data...!" });
      }

      const { username, email, password } = req.body;

      // Check for duplicate users
      const checkexisting = await Users.findOne({ email });
      if (checkexisting) {
        return res
          .status(422)
          .json({ message: "User Already Exists! Use new Email ID." });
      }

      // Hash password
      const hashedPassword = await hash(password, 12);
      const newUser = await Users.create({ username, email, password: hashedPassword });

      return res
        .status(201)
        .json({ message: 'Registration Successful!', user: newUser });
    } else {
      return res
        .status(500)
        .json({ message: "HTTP method not valid, only POST is accepted" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Connection Failed" });
  }
}
