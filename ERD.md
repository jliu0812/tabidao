# TabiDao — Entity Relationship Diagram

```
User ──< Itinerary ──< Day ──< Event
```

## Entities

### User
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| email | String | Unique |
| name | String? | From OAuth profile |
| image | String? | OAuth avatar URL |
| emailVerified | DateTime? | Auth.js field |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

### Itinerary
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| title | String | e.g. "Tokyo 2025" |
| destination | String? | e.g. "Tokyo, Japan" |
| startDate | DateTime? | Optional trip start |
| endDate | DateTime? | Optional trip end |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |
| userId | String | FK → User (cascade delete) |

### Day
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| dayNumber | Int | 1-based index within the itinerary |
| date | DateTime? | Actual calendar date (optional) |
| itineraryId | String | FK → Itinerary (cascade delete) |

**Constraints:** `(itineraryId, dayNumber)` is unique.

### Event
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| description | String | Activity name / notes |
| timeStart | String? | "HH:MM" 24-hour format, e.g. "09:30" |
| timeEnd | String? | "HH:MM" 24-hour format, e.g. "11:00" |
| location | String? | Human-readable place name |
| latitude | Float? | Decimal degrees, for map pin |
| longitude | Float? | Decimal degrees, for map pin |
| dayId | String | FK → Day (cascade delete) |

## Relationships

| From | To | Cardinality | Delete behaviour |
|---|---|---|---|
| User | Itinerary | 1 → many | Cascade |
| Itinerary | Day | 1 → many | Cascade |
| Day | Event | 1 → many | Cascade |

## Notes

- `timeStart` / `timeEnd` are plain strings (e.g. `"09:30"`) rather than full `DateTime` values because the time-of-day is meaningful without a specific date, and the date lives on the parent `Day`.
- `latitude` / `longitude` are populated by the AI assistant when the event has a known geographic location. Events without coordinates are still stored but do not appear on the map.
- Auth.js internal models (`Account`, `Session`, `VerificationToken`) are omitted from this diagram as they are infrastructure, not domain models.
