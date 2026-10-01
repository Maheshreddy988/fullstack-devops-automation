const User = require("../../model/User")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const secret = "exceleed-meterial-tracking";
const sendVerificationCode = require("../../helpers/sendVerificationCode")

// userCreation route
const superAdminSignup = async (req, res) => {
    try {

        const { username, email, contactNumber, password } = req.body;
        // console.log("req.body", req.body);

        const existingUser = await User.findOne({ $or: [{ email }, { contactNumber }] })


        if (existingUser) {

            if (existingUser.email === email) {
                return res.status(400).json({ message: "this email already exists " })
            }
            if (existingUser.contactNumber === contactNumber) {
                return res.status(400).json({ message: "contactNumber Already Exists" })
            }
        };
        // console.log("existingUser", existingUser);

        const hashPassword = await bcrypt.hash(password, 10);

        // Generate verification code
        
        const newUser = new User({
            username,
            email,
            contactNumber,
            password: hashPassword,
            // verifyCode,
            // verifyCodeExpiry,
            isVerified: true,
            role: "SuperAdmin",
        })

        await newUser.save();
        // console.log("newUser", newUser);
        return res.status(200).json({ message: "SuperAdmin registered successfully. Please verify your email.", newUser })
    } catch (error) {
        console.error("error User Creation", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

//superAdmin verify Account
const superAdminVerifyAccount = async (req, res) => {
    try {

        const { superAdminId } = req.params;
        const { code } = req.body;

        // console.log(`this is the sa id:${superAdminId} and this is thecode:${code}`);

        const existingSuperAdmin = await User.findById(superAdminId)

        if (!existingSuperAdmin || existingSuperAdmin.role !== 'SuperAdmin') {
            return res.status(404).json({ message: "invalid role: SuperAdmin can only veryfy the Account" })
        }

        // here verify the code and change the verifystate false to true
        if (existingSuperAdmin.verifyCode === code) {
            existingSuperAdmin.isVerified = true;
            await existingSuperAdmin.save()
            return res.status(201).json({ message: "Code verified successfully" })
        } else {
            return res.status(400).json({ message: "Invalid verification code" });
        }

    } catch (error) {
        console.error("Error fetching verify code:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

//userLoginroute
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log("req.body", req.body);


        // Step 1: Find user by email (case-insensitive)
        const user = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, "i") }
        });

        console.log("existingUser", user);

        // step 2 : checking the User wether itis verified or not
       

        const passwordmatch = bcrypt.compare(password, user.password);
    

        if (!passwordmatch) {
            return res.status(400).json({ message: "wrong password" })
        }

        const token = jwt.sign({
            _id: user._id
        }, secret, { expiresIn: "1h" })

        console.log("jwt token", token);


        return res.status(200).json({
            message: "Login request success", user, token
        })

    } catch (error) {
        console.error("login route error", error);
        return res.status(500).json({ message: "An error occurred while processing the user login request.", error: error.message })
    }
}

//userupdation route
const userUpdate = async (req, res) => {
    try {

        const { superadminId, userId } = req.params;
        const { username, email, contactNumber, password } = req.body;

        const SuperAdminUser = await User.findById(superadminId);

        if (!SuperAdminUser || SuperAdminUser.role !== "SuperAdmin") {
            return res.status(403).json({ message: "Unauthorized action: User updates are restricted to Super Admins only." })
        }

        const updateUser = await User.findByIdAndUpdate(userId, { username, email, contactNumber, password })

        if (!updateUser) {
            return res.status(400).json({ message: "User not found or invalid data." })
        }
        return res.status(200).json({ message: "User updation successfully" })

    } catch (error) {
        return res.status(500).json({ message: "Error occurred while updating user details.", error: error.message })
    }
}

//SuperAdmin creates Admin and Users

const superAdminCreateUsers = async (req, res) => {
    try {
        const { superadminId } = req.params;
        const { username, email, contactNumber, password, role } = req.body;

        const superAdmin = await User.findById(superadminId)

        if (!superAdmin || superAdmin.role !== "SuperAdmin") {
            return res.status(403).json({ message: "Unauthorized action: User creates are restricted to Super Admins only." })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const adminareUserCreation = new User({
            username, email, contactNumber, password: hashPassword,isVerified: true, role
        })

        await adminareUserCreation.save();
        return res.status(200).json({ message: "user created successfully", adminareUserCreation })

    } catch (error) {
        console.log("error occur in superAdmincreatesUsers roote", error)
        return res.status(500).json({ message: "An error occurred while user creation.", error: error.message })
    }
}

const superAdminGetUsers = async (req, res) => {
    try {
        const { superadminId } = req.params;

        const superAdmin = await User.findById(superadminId)

        if (!superAdmin || superAdmin.role !== "SuperAdmin") {
            return res.status(403).json({ message: "Unauthorized action: User creates are restricted to Super Admins only." })
        }

        const adminareUserCreation = await User.find()

     
        return res.status(200).json({ message: "user created successfully", adminareUserCreation })

    } catch (error) {
        console.log("error occur in superAdmincreatesUsers roote", error)
        return res.status(500).json({ message: "An error occurred while user creation.", error: error.message })
    }
}


module.exports = { superAdminSignup, userLogin, userUpdate, superAdminCreateUsers, superAdminVerifyAccount,superAdminGetUsers }