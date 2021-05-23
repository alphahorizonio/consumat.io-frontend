import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { createRef, useEffect, useState } from "react";
import Spinner from "../components/helper/Spinner";
import ErrorMessage from "../components/helper/ErrorMessage";
import MetaData from "../components/MetaData";
import SearchResultList from "../components/search/SearchResultList";
import { useAuthorization } from "../hooks/AuthnHooks";
import { useGetSearch } from "../hooks/DataHooks";

export const getServerSideProps: GetServerSideProps = async (context) => ({
  props: { session: await getSession(context) },
});

const Search = () => {
  const [session] = useAuthorization();
  if (!session) return null;

  const router = useRouter();

  useEffect(() => {
    router.push({ query: { q: null } }, undefined, { shallow: true });
  }, []);

  const { q } = router.query;
  const [query, setQuery] = useState<string>("");
  const { data, loading, error } = useGetSearch(q, 1);

  useEffect(() => {
    console.log(router.query.q);
  }, [router.query]);

  const form = createRef<HTMLFormElement>();

  return (
    <div className="px-4">
      <MetaData title="consumat.io | Search" />

      <form
        ref={form}
        onSubmit={(event) => {
          event.preventDefault();
          router.push({ query: { q: query } }, undefined, { shallow: true });
        }}
        autoComplete="off"
        className="flex flex-col lg:flex-row mb-2"
      >
        <div className="flex mb-2 w-full lg:w-1/2 lg:mr-2 lg:flex-grow">
          <input
            type="search"
            name="q"
            placeholder="Search..."
            required
            onChange={(event) => setQuery(event.target.value)}
            className="p-2 rounded-l w-full mr-0.5 dark:text-gray-800"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-r dark:text-gray-800"
          >
            Search
          </button>
        </div>
      </form>

      {error && <ErrorMessage />}

      {loading ? (
        <Spinner />
      ) : (
        data != null && <SearchResultList mediaList={data.search.results} />
      )}
    </div>
  );
};

export default Search;
