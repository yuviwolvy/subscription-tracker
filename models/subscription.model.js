import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required."],
      trim: true,
      minLength: 3,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required."],
      min: [0, "Subscription Price must be greater than 0"],
    },
    currency: {
      type: String, // The value must be a string

      // 'enum' restricts the field to accept only specific values
      // If any value other than "INR", "USD", or "EUR" is provided, Mongoose will throw a validation error
      enum: ["INR", "USD", "EUR"],

      // If no value is provided for this field, it will default to "INR"
      default: "INR",

      // If you want to make this field required, you'd add:
      // required: [true, "Currency is required."]

      // With 'required', if the value is missing during document creation,
      // Mongoose will throw a validation error with the provided message
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: [true, "Subscription frequency is required."],
    },
    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "politics",
        "other",
      ],
      required: [true, "Subscription category is required"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Subscription payment method is required."],
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: [true, "Subscription start date is required."],
      validate: {
        validator: (value) => value < new Date(),
        message: "Start date must be less than current date.",
      },
    },
    renewalDate: {
      type: Date,
      required: [true, "Subscription renewal date is required."],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after the date.",
      },
    },
    user: {
      // The type is ObjectId, which is used to reference another document
      // In this case, it will store the _id of a User document
      type: mongoose.Schema.Types.ObjectId,

      // 'ref' tells Mongoose which model to reference
      // This sets up a relationship between this document and the 'User' model
      // Enables population (i.e., replacing the ObjectId with actual User data when using .populate())
      ref: "User",

      // Makes this field required — a value must be provided
      // If it's missing, the provided error message will be thrown
      required: [true, "User related to subscription is required."],

      // This creates an index on the 'user' field in MongoDB
      // Think of an index like a table of contents in a book — it helps MongoDB find data faster
      // So if you often search subscriptions by user (e.g., find all subscriptions of a user),
      // this index speeds up those queries
      // Without an index, MongoDB has to scan every document in the collection
      // Normally, when you query a collection (e.g., find all subscriptions by a user),
      // MongoDB would scan every document to check the 'user' field — this is called a full collection scan.

      // But with an index on the 'user' field, MongoDB builds a separate internal data structure,
      // like a sorted list or B-tree, that maps user IDs to document locations.

      // So instead of checking every document, MongoDB can go straight to the relevant ones
      // — just like using an index at the back of a textbook to find a topic instantly
      // instead of reading every page.

      // Result: Much faster queries on that field, especially when the collection grows large.
      // In this case, "document" means each individual record in the **Subscription** collection.

      // So when you run something like: Subscriptions.find({ user: someUserId })
      // MongoDB looks at every **subscription document** to check its 'user' field.

      // Without an index, MongoDB must scan every subscription to see which ones match the user ID.
      // The "index structure" in MongoDB is typically a **B-tree** (balanced tree),
      // not just a simple lookup table.

      // When you create an index on a field (like 'user'),
      // MongoDB builds a B-tree where keys are the field values (user IDs)
      // and values point to the actual documents in the collection.

      // This tree is sorted and optimized for fast searching — like binary search on steroids.

      // So instead of scanning every document one by one,
      // MongoDB traverses the B-tree to find matching keys and then quickly fetches those documents.

      // That’s how indexing actually makes queries much faster — especially on large datasets.

      index: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency]
    );

    if (this.renewalDate < new Date()) {
      this.status = "expired";
    }

    next();
  }
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
