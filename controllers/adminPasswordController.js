const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Change Password Page
exports.changePasswordPage = async (req, res) => {
    try {
        res.render("admin/change_password", { session: req.session });
    } catch (err) {
        console.log("Change Password Page Error:", err);
        res.send("Error: " + err.message);
    }
};

// Change Password Logic
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const adminId = req.session.user.id;

        // Validate input
        if (!currentPassword || !newPassword || !confirmPassword) {
            req.session.error = "All fields are required";
            return res.redirect("/admin/change-password");
        }

        if (newPassword !== confirmPassword) {
            req.session.error = "New passwords do not match";
            return res.redirect("/admin/change-password");
        }

        if (newPassword.length < 6) {
            req.session.error = "Password must be at least 6 characters";
            return res.redirect("/admin/change-password");
        }

        // Get admin from database
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== "admin") {
            req.session.error = "Admin not found";
            return res.redirect("/admin/change-password");
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            req.session.error = "Current password is incorrect";
            return res.redirect("/admin/change-password");
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await User.findByIdAndUpdate(adminId, { password: hashedPassword });

        req.session.success = "Password changed successfully";
        return res.redirect("/admin/dashboard");

    } catch (err) {
        console.log("Change Password Error:", err);
        req.session.error = "Error changing password";
        res.redirect("/admin/change-password");
    }
};
