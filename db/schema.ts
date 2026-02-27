import { integer, real, sqliteTable, text, } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    uid: text('id').primaryKey(),
    name: text('name'),
    email: text('email').unique(),
    password: text('password'),
    image: text('image'),
    is_dirty: integer('is_dirty').default(0),
    updated_at: text('updated_at'),
})

export const wallets = sqliteTable('wallets', {
    id: integer('id').primaryKey({autoIncrement: true}),
    name: text('name'),
    amount: real('amount'),
    totalIncome: real('totalIncome'),
    totalExpenses: real('totalExpenses'),
    image: text('image'),
    created: text('created'),
    is_dirty: integer('is_dirty').default(0),
    marked_to_delete: integer('marked_to_delete').default(0), 
    user: text('user').references(() => users.uid)
    
})

export const notifications = sqliteTable('notifications', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    frequency: integer('frequency').notNull(), 
    schedule_date: text('schedule_date').notNull(),
    schedule_time: text('schedule_time').notNull(),
    enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
    marked_to_delete: integer('marked_to_delete', {mode: 'boolean'}).default(false), 
    user: text('user').references(() => users.uid)
});


export const transactions = sqliteTable('transactions', {
    id: integer('id').primaryKey({autoIncrement: true}),
    type: text('type'),
    amount: real('amount'),
    category: text('category'),
    description: text('description'),
    image: text('image'),
    date: text('date'),
    user: text('uid').references(() => users.uid),
    walletId: integer('walletId').references(() => wallets.id),
    is_dirty: integer('is_dirty').default(0),
    marked_to_delete: integer('marked_to_delete').default(0)
})

export type User = typeof users.$inferInsert
export type NotificationRecord = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;