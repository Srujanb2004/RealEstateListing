"""Search helpers.

`CITY_ALIASES` / `normalize_city` are a direct port of
frontend/src/utils/constants.js so a search for "Bangalore" matches
listings stored as "Bengaluru" exactly the way the offline fallback did.
"""

CITY_ALIASES = {
    "bangalore": "bengaluru",
    "bengaluru": "bengaluru",
    "bombay": "mumbai",
    "mumbai": "mumbai",
    "hyderabad": "hyderabad",
    "secunderabad": "hyderabad",
    "poona": "pune",
    "pune": "pune",
    "chennai": "chennai",
    "madras": "chennai",
    "delhi": "delhi ncr",
    "new delhi": "delhi ncr",
    "gurgaon": "delhi ncr",
    "gurugram": "delhi ncr",
    "noida": "delhi ncr",
    "delhi ncr": "delhi ncr",
}


def normalize_city(value: str) -> str:
    key = (value or "").strip().lower()
    return CITY_ALIASES.get(key, key)


def city_matches(query: str, city: str, locality: str) -> bool:
    """Bidirectional substring match on normalized city, plus locality.

    Bidirectional so both "delhi" -> "delhi ncr" and "delhi ncr" -> "delhi"
    hit, which is what the frontend fallback did.
    """
    q = normalize_city(query)
    if not q:
        return True
    normalized_city = normalize_city(city or "")
    if normalized_city and (q in normalized_city or normalized_city in q):
        return True
    return q in (locality or "").lower()


SORTERS = {
    "price_asc": lambda p: p.price or 0,
    "price_desc": lambda p: -(p.price or 0),
    "area_desc": lambda p: -(p.area_sqft or 0),
}
