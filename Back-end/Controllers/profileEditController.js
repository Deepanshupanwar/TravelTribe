
const User = require('../Models/UserTraveller');

// Update user profile
exports.editProfile = async (req, res) => {
    console.log("inside the PUT /profile -> the editor");
    try {
        const userId = req.user.id; // Get the authenticated user's ID
        const { username, email, profile_picture } = req.body; // Destructure the fields you want to allow for updating

        // Find the user by ID and update the relevant fields
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, profile_picture },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
    }
};

// Delete user profile
exports.deleteProfile = async (req, res) => {
    console.log("inside the delete /profile -> the delte user ");
    try {
        const userId = req.user.id; // Get the authenticated user's ID

        // Find the user by ID and delete
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting profile", error });
    }
};
