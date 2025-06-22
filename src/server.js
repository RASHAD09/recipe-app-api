import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";

const app = express();
const PORT = ENV.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.get("/api/health",(req,res)=>{
  res.status(200).json({success: true, message: "Server is healthy!"
  });
})

app.get("/", (req, res) => {
  res.send("Hello, Worldssssssssss!");
});
app.get("/api", (req, res) => {
  res.json({ message: "Hello from the API!" });
}); 

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookingTime, servings } = req.body;
    // Validate required fields
    if (!userId || !recipeId || !title || !image || !cookingTime || !servings) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

   

 const newFavorite = await db.insert(favoritesTable).values({
    userId,
    recipeId,
    title,
    image,
    cookingTime,
    servings
  }).returning();
  res.status(201).json(newFavorite[0]);
  } catch {
    res.status(400).json({ success: false, message: "Invalid request data" });
    return;
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userFavorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId));

    // Validate userId
    res.status(200).json(userFavorites);
    if (!userId) {
      res.status(400).json({ success: false, message: "Missing userId" });
      return;
    }

    // Fetch favorites for the user
    const favorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId));

    if (favorites.length === 0) {
      res.status(404).json({ success: false, message: "No favorites found for this user" });
      return;
    }

    res.status(200).json(favorites);

  }
  
  catch (error) {
    res.status(400).json({ success: false, message: "Invalid request data" });
  }


})


 app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  

  try {

    const{userId,recipeId} = req.params

    
    //  db.delete(favoritesTable).where(
    //   favoritesTable.userId.eq(userId).and(favoritesTable.recipeId.eq(recipeId))
    // );
   await db.delete(favoritesTable).where(
      and(
        eq(favoritesTable.userId,userId),
        eq(favoritesTable.recipeId,parseInt(recipeId)),
      )
    );
    res.status(200).json({ success: true, message: "Favorite deleted successfully" });

  }
  catch (error) {
    res.status(400).json({ success: false, message: "Invalid request data" });  
    }})


    