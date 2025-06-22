import { pgTable, serial, integer, timestamp, text } from 'drizzle-orm/pg-core';

export const favoritesTable = pgTable('favorites', {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull().unique(),
    recipeId: integer('recipe_id').notNull(),
    title: text('title').notNull(),
    image: text('image'),
    cookingTime: text('cooking_time'), // ✅ تم التصحيح هنا
    servings: text('servings').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
