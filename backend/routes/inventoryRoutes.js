const express = require("express");
const Inventory = require("../models/Inventory");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { nameOfRawMaterial, price, quantity } = req.body;
  try {
    const newInventory = new Inventory({ nameOfRawMaterial, price, quantity });
    const savedInventory = await newInventory.save();

    res.status(201).json({
      status: true,
      message: "Item added to Inventory successfully",
      inventory: savedInventory,
    });
  } catch (error) {
    console.error("Error adding inventory:", error.message);
    res.status(500).json({
      status: false,
      message: "An error occurred while adding item to inventory",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const inventoryItems = await Inventory.find();
    res.status(200).json({ status: true, inventoryItems });
  } catch (error) {
    console.error("Error fetching inventory:", error.message);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching inventory",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nameOfRawMaterial, price, quantity } = req.body;

  try {
    const updatedInventoryItem = await Inventory.findByIdAndUpdate(
      id,
      { nameOfRawMaterial, price, quantity },
      { new: true }
    );
    if (!updatedInventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.status(200).json({
      message: "Inventory item updated successfully",
      inventory: updatedInventoryItem,
    });
  } catch (error) {
    console.error("Error updating inventory item:", error.message);
    res.status(500).json({
      message: "An error occurred while updating inventory item",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedInventoryItem = await Inventory.findByIdAndDelete(id);
    if (!deletedInventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.status(200).json({
      message: "Inventory item deleted successfully",
      inventory: deletedInventoryItem,
    });
  } catch (error) {
    console.error("Error deleting inventory item:", error.message);
    res.status(500).json({
      message: "An error occurred while deleting inventory item",
      error: error.message,
    });
  }
});

module.exports = router;
