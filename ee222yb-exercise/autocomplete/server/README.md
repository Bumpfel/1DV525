# API

## Getting all teams

### `api/teams`

You can retrieve all the teams.

Example of a request:

```
GET api/teams HTTP/1.1
Accept: application/json
```

```
$ curl 'http://localhost:3000/api/teams' -i -H 'Accept: application/json'
```

Example of success response:

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "count": 20,
    "teams": [
        {
            "id": 1,
            "name": "Arsenal"
        },
        {
            "id": 127,
            "name": "Bournemouth"
        },
        {
            "id": 131,
            "name": "Brighton and Hove Albion"
        },
        --- DATA OMITTED FOR CLARITY  ---
        {
            "id": 25,
            "name": "West Ham United"
        }
    ]
}
```

| Path     | Type   | Description            |
|----------|--------|------------------------|
| id       | Number | The team's id          |
| name     | String | The team's name        |

## Filter the teams

### `api/teams?q=:q`

You can filter the list of teams to contain only those teams which names contains the string specified by the query parameter `q`.

Example of a request:

```
GET api/teams?q=ci HTTP/1.1
Accept: application/json
```

```
$ curl 'http://localhost:3000/api/teams?q=ci' -i -H 'Accept: application/json'
```

Example of success response:

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "query": "ci",
  "count": 4,
  "teams": [
    {
      "id": 26,
      "name": "Leicester City"
    },
    {
      "id": 11,
      "name": "Manchester City"
    },
    {
      "id": 42,
      "name": "Stoke City"
    },
    {
      "id": 45,
      "name": "Swansea City"
    }
  ]
}
```

| Path     | Type   | Description            |
|----------|--------|------------------------|
| id       | Number | The team's id          |
| name     | String | The team's name        |

## Getting a team using it's id

### `api/teams/:id`

To retrieve a team, you need to know its id, which should be provided as a part of the URL.

Example of a request:

```
GET api/teams/42 HTTP/1.1
Accept: application/json
```

```
$ curl 'http://localhost:3000/api/teams/42' -i -H 'Accept: application/json'
```

Example of success response:

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "id":42,
  "name":"Stoke City",
  "nickname":"Potters",
  "url":"http://www.stokecityfc.com"
} 
```

| Path     | Type   | Description             |
|----------|--------|-------------------------|
| id       | Number | The team's id           |
| name     | String | The team's name         |
| nickname | String | The team's nickname     |
| url      | String | The team's official URL |
