import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import GoodieOrder from "../models/GoodieOrder.js";
import Goodie from "../models/Goodie.js";

export const requestGoodieOrder = async (req, res, next) => {
  try {
    const { goodieTitle, coins, description = "", address = {} } = req.body;
    if (!goodieTitle || !coins) {
      return res.status(400).json({
        success: false,
        error: "Goodie title and coin value are required"
      });
    }

    const allowedRoles = ["student", "school_student"];
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Only students can request goodies"
      });
    }

    let wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet || wallet.balance < coins) {
      return res.status(400).json({
        success: false,
        error: "Insufficient HealCoins balance"
      });
    }

    const walletBefore = wallet.balance;
    wallet.balance -= coins;
    wallet.lastUpdated = new Date();
    await wallet.save();

    await Transaction.create({
      userId: req.user._id,
      type: "spend",
      amount: coins,
      description: `Goodie order: ${goodieTitle}`,
      coinType: "healcoins"
    });

    const order = await GoodieOrder.create({
      userId: req.user._id,
      userName: req.user.name || req.user.fullName || req.user.displayName || "Student",
      userEmail: req.user.email,
      contactNumber: address.contactNumber || req.user.contactNumber || req.user.phone || "",
      goodieTitle,
      coins,
      description,
      address: {
        contactNumber: address.contactNumber || req.user.contactNumber || req.user.phone || "",
        line1: address.addressLine1 || address.line1 || "",
        line2: address.addressLine2 || address.line2 || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        instructions: address.instructions || ""
      },
      status: "requested",
      healCoinsBefore: walletBefore,
      healCoinsAfter: wallet.balance
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("goodie:order", order.toObject());
    }

    res.json({
      success: true,
      order,
      walletBalance: wallet.balance
    });
  } catch (error) {
    console.error("Error creating goodie order:", error);
    next(error);
  }
};

export const listActiveGoodies = async (req, res, next) => {
  try {
    const goodies = await Goodie.find({ isActive: true })
      .sort({ coins: 1 })
      .lean();
    res.json({
      success: true,
      goodies
    });
  } catch (error) {
    console.error("Error fetching goodies:", error);
    next(error);
  }
};

export const listAllGoodies = async (req, res, next) => {
  try {
    const goodies = await Goodie.find()
      .sort({ createdAt: -1 })
      .lean();
    res.json({
      success: true,
      goodies
    });
  } catch (error) {
    console.error("Error fetching all goodies:", error);
    next(error);
  }
};

export const createGoodie = async (req, res, next) => {
  try {
    const { title, coins, description = "", imageUrl = "", isActive = true } = req.body;
    if (!title || !coins) {
      return res.status(400).json({
        success: false,
        error: "Title and coin value are required"
      });
    }

    const goodie = await Goodie.create({
      title: title.trim(),
      description: description.trim(),
      coins: Number(coins),
      imageUrl: imageUrl.trim(),
      isActive: isActive !== false,
      createdBy: req.user?._id
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("goodie:catalog:new", goodie);
    }

    res.status(201).json({
      success: true,
      goodie
    });
  } catch (error) {
    console.error("Error creating goodie:", error);
    next(error);
  }
};

export const deleteGoodie = async (req, res, next) => {
  try {
    const { goodieId } = req.params;
    if (!goodieId) {
      return res.status(400).json({
        success: false,
        error: "Goodie ID is required"
      });
    }

    const goodie = await Goodie.findById(goodieId);
    if (!goodie) {
      return res.status(404).json({
        success: false,
        error: "Goodie not found"
      });
    }

    await goodie.deleteOne();

    const io = req.app.get("io");
    if (io) {
      io.emit("goodie:catalog:delete", goodie.toObject());
    }

    res.json({
      success: true,
      goodieId
    });
  } catch (error) {
    console.error("Error deleting goodie:", error);
    next(error);
  }
};

export const getGoodieOrders = async (req, res, next) => {
  try {
    const orders = await GoodieOrder.find()
      .sort({ createdAt: -1 })
      .lean();
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Error fetching goodie orders:", error);
    next(error);
  }
};

export const updateGoodieOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!["requested", "delivered"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status"
      });
    }

    const order = await GoodieOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    order.status = status;
    order.deliveredAt = status === "delivered" ? new Date() : null;
    await order.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("goodie:order:update", order.toObject());
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Error updating goodie order status:", error);
    next(error);
  }
};
