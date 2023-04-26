# Open Groups Hub

To run locally, install the dependencies:

```sh
npm install
```

If you will be contributing to the repo, prepare the pre-commit git hook:

```sh
npm run prepare
```

_**Set your environment variables in an `.env` file.**_

Start the development server:

```sh
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000) and try it out!

## TODO

- [x] Setup top nav in root route
- [x] Setup ErrorBoundary
- [x] Set larger pagesizes when fetching from Index (maximum is 500)
- [x] Create Needs page
- [ ] Add link to group's needs, if it has any
- [ ] Add link from need to its group, if there is one (sometimes a need might be created with no matched group via the primary_url)
