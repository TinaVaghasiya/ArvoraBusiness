import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js'; 

// Admin Login
export const adminLogin = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Allow login with either username OR email + password
        if (!password || (!username && !email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password and either username or email are required' 
            });
        }

        // Find admin by username or email
        const query = username ? { username } : { email };
        const admin = await Admin.findOne({ ...query, isActive: true });
        
        if (!admin) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        const token = jwt.sign(
            { 
                id: admin._id, 
                username: admin.username, 
                email: admin.email, 
                role: admin.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES || '24h' }
        );

        res.status(200).json({ 
            success: true, 
            message: 'Admin logged in successfully', 
            token,
            admin: {
                id: admin._id, 
                username: admin.username, 
                email: admin.email, 
                role: admin.role,
                createdAt: admin.createdAt
            } 
        });
    } catch (error) {
        console.error('Login failed', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

// GET - Get all admins
export const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                admins,
                total: admins.length
            }
        });
    } catch (error) {
        console.error('Get admins error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching admins' 
        });
    }
};

// GET - Get single admin by ID
export const getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select('-password');
        
        if (!admin) {
            return res.status(404).json({ 
                success: false, 
                message: 'Admin not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: admin
        });
    } catch (error) {
        console.error('Get admin error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching admin' 
        });
    }
};

// POST - Create new admin
export const createAdmin = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validation based on your schema
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username, email, and password are required' 
            });
        }

        if (username.length < 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username must be at least 3 characters long' 
            });
        }

        if (password.length < 8 || password.length > 15) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be between 8-15 characters' 
            });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ 
            $or: [{ username }, { email }] 
        });

        if (existingAdmin) {
            return res.status(400).json({ 
                success: false, 
                message: 'Admin with this username or email already exists' 
            });
        }

        // Create new admin
        const admin = new Admin({
            username,
            email,
            password,
            role: role || 'admin'
        });

        await admin.save();

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: admin
        });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during admin creation' 
        });
    }
};

// PUT - Update admin
export const updateAdmin = async (req, res) => {
    try {
        const { username, email, password, role, isActive } = req.body;
        const adminId = req.params.id;

        // Find admin
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ 
                success: false, 
                message: 'Admin not found' 
            });
        }

        // Check if username/email already exists (excluding current admin)
        if (username || email) {
            const existingAdmin = await Admin.findOne({
                _id: { $ne: adminId },
                $or: [
                    ...(username ? [{ username }] : []),
                    ...(email ? [{ email }] : [])
                ]
            });

            if (existingAdmin) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Username or email already exists' 
                });
            }
        }

        // Validate password length if provided
        if (password && (password.length < 8)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be 8 characters' 
            });
        }

        // Validate username length if provided
        if (username && username.length < 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username must be at least 3 characters long' 
            });
        }

        // Update fields
        if (username) admin.username = username;
        if (email) admin.email = email;
        if (password) admin.password = password; 
        if (role) admin.role = role;
        if (typeof isActive !== 'undefined') admin.isActive = isActive;

        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Admin updated successfully',
            data: admin
        });
    } catch (error) {
        console.error('Update admin error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during admin update' 
        });
    }
};

// DELETE - Delete admin
export const deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;

        if (req.admin && req.admin.id === adminId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot delete your own account' 
            });
        }

        const admin = await Admin.findByIdAndDelete(adminId);
        
        if (!admin) {
            return res.status(404).json({ 
                success: false, 
                message: 'Admin not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Admin deleted successfully'
        });
    } catch (error) {
        console.error('Delete admin error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during admin deletion' 
        });
    }
};

// Verify Token
export const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id).select('-password');
        
        if (!admin || !admin.isActive) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        }

        res.status(200).json({
            success: true,
            admin: admin
        });
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
};
