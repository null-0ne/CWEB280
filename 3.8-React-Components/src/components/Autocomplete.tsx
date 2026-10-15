import { useEffect, useState } from "react";
import { Label, TextInput, HelperText } from "flowbite-react";

export default function Autocomplete({
  id,
  label,
  endpoint,
  displayField,
  placeholder,
  onSelect, // is a function passed in from the "parent" page
}) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [error, setError] = useState("");
  const listId = `${id}-suggestions`; // Make a new id for the data list - why (we may have more than one autocomplete on the same page)

  useEffect(() => {
    const search = query.trim();
    if (!search) {
      setOptions([]);
      setError("");
      return undefined;
    }

    async function searchOptions() {
      setError("");
      try {
        const searchParams = new URLSearchParams({ search });
        const response = await fetch(`${endpoint}?${searchParams}`);

        if (!response.ok) {
          throw new Error(`Unable to search ${label.toLowerCase()}.`);
        }

        const results = await response.json();
        if (!Array.isArray(results) || !results.length) {
          throw new Error(`${label.toLowerCase()} not found.`);
        }

        setOptions(results);
      } catch (searchError) {
        setOptions([]);
        setError(
          searchError instanceof Error
            ? searchError.message
            : `Unable to search ${label.toLowerCase()}.`,
        );
      }
    }

    searchOptions();
    return undefined;
  }, [displayField, endpoint, label, query]);

  return (
    <div className="form-field">
      {/* Pre-styled Flowbite-React component - Label */}
      <Label htmlFor={id}>{label}</Label>
      {/* Pre-styled Flowbite-React component - TextInput */}
      <TextInput
        type="search"
        addon="🔍"
        id={id}
        list={listId}
        onChange={(event) => {
          const value = event.target.value;
          setQuery(value);
          // this section below is searching for the selected "name" / "title" within the options array
          // all so we can get the corresponding option "id"
          const match = options.find(
            (option) =>
              String(option[displayField]).toLocaleLowerCase() ===
              value.toLocaleLowerCase(),
          );
          onSelect(match ?? null);
        }}
        placeholder={placeholder}
        value={query}
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option.id} value={option[displayField]} />
        ))}
      </datalist>
      {error && <HelperText color="failure">{error}</HelperText>}
    </div>
  );
}
