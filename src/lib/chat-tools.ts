import { tool } from "ai";
import { z } from "zod";
import { db } from "@/lib/db";

export function buildTools(itineraryId: string, userId: string) {
  return {
    getItinerary: tool({
      description: "Fetch the full itinerary including all days and events. Call this to understand the current plan before making changes.",
      parameters: z.object({}),
      execute: async () => {
        const itinerary = await db.itinerary.findUnique({
          where: { id: itineraryId, userId },
          include: {
            days: {
              include: { events: true },
              orderBy: { dayNumber: "asc" },
            },
          },
        });
        return itinerary;
      },
    }),

    createDay: tool({
      description: "Add a new day to the itinerary.",
      parameters: z.object({
        dayNumber: z.number().int().positive().describe("Day number (1 = first day, 2 = second day, etc.)"),
        date: z.string().optional().describe("ISO date string e.g. 2025-06-15 (optional)"),
      }),
      execute: async ({ dayNumber, date }) => {
        const day = await db.day.create({
          data: {
            dayNumber,
            date: date ? new Date(date) : null,
            itineraryId,
          },
        });
        return day;
      },
    }),

    addEvent: tool({
      description: "Add an event or activity to a specific day. For well-known tourist locations, include latitude and longitude so they appear on the map.",
      parameters: z.object({
        dayId: z.string().describe("The ID of the day to add this event to"),
        description: z.string().describe("Activity name or description, e.g. 'Visit Eiffel Tower'"),
        timeStart: z.string().optional().describe("Start time in HH:MM format, e.g. '09:00'"),
        timeEnd: z.string().optional().describe("End time in HH:MM format, e.g. '11:00'"),
        location: z.string().optional().describe("Human-readable place name"),
        latitude: z.number().optional().describe("Latitude for map pin"),
        longitude: z.number().optional().describe("Longitude for map pin"),
      }),
      execute: async ({ dayId, description, timeStart, timeEnd, location, latitude, longitude }) => {
        const event = await db.event.create({
          data: { dayId, description, timeStart, timeEnd, location, latitude, longitude },
        });
        return event;
      },
    }),

    updateEvent: tool({
      description: "Update an existing event. Only provide the fields you want to change.",
      parameters: z.object({
        eventId: z.string().describe("The ID of the event to update"),
        description: z.string().optional(),
        timeStart: z.string().optional(),
        timeEnd: z.string().optional(),
        location: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      }),
      execute: async ({ eventId, ...updates }) => {
        const event = await db.event.update({
          where: { id: eventId },
          data: updates,
        });
        return event;
      },
    }),

    deleteEvent: tool({
      description: "Remove an event from the itinerary.",
      parameters: z.object({
        eventId: z.string().describe("The ID of the event to delete"),
      }),
      execute: async ({ eventId }) => {
        await db.event.delete({ where: { id: eventId } });
        return { deleted: true, eventId };
      },
    }),
  };
}

export const SYSTEM_PROMPT = `You are TabiDao, a friendly travel planning assistant. Help users plan and organise their trip itineraries.

You have tools to manage the itinerary:
- getItinerary: View the current plan (call this first if you need context)
- createDay: Add a numbered day to the trip
- addEvent: Add an activity/event to a specific day
- updateEvent: Edit an existing event
- deleteEvent: Remove an event

When a user describes activities, meals, transport, or accommodation, use the tools to create or update the relevant events. For well-known locations (Eiffel Tower, Colosseum, Shibuya Crossing, etc.), include accurate latitude and longitude so they appear on the map. Always confirm what you added or changed after each tool call.`;
