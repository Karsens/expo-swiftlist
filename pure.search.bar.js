import React from "react";
import { Animated, TextInput } from "react-native";
import * as Icon from "@expo/vector-icons";

type SearchFilterProps = {
  /**
   * the objects array that needs to be returned a subset of
   */
  objectArray: Object[],

  /**
   * the objects array, mapped to the searchable parts of every object
   */
  searchableStringArray: string[],

  /**
   * the raw search query
   */
  searchQuery: string
};

/**
 * searchFilter returns a filtered array of objects, based on the search query and the searchable string of each object
 */
const searchFilter = ({
  objectArray,
  searchableStringArray,
  searchQuery
}: SearchFilterProps): Object[] => {
  const match = searchableString =>
    searchableString?.toLowerCase().includes(searchQuery?.toLowerCase());

  return objectArray.filter(
    (object, index) => !searchQuery || match(searchableStringArray[index])
  );
};

/**
 *
 * SearchBar renders a SearchBar TextInput with Icon
 */
class SearchBar extends React.Component {

  static searchFilter = searchFilter;

  render() {
    const { onFocus, onBlur, onChange, reference, style } = this.props;

    return (
      <Animated.View
        style={[
          {
            height: 33,
            marginVertical: 2,
            marginHorizontal: 0,
            flexDirection: "row",
            backgroundColor: "#DDD",
            borderRadius: 10,
            alignItems: "center"
          },
          style
        ]}
      >
        <Icon.Ionicons
          style={{ margin: 5 }}
          color="#AAA"
          name="ios-search"
          size={24}
        />
        <TextInput
          ref={ref => reference?.(ref)}
          clearButtonMode="always"
          style={{ flex: 1, height: 35 }}
          placeholder="Search"
          autoCorrect={false}
          onFocus={e => onFocus?.(e)}
          onBlur={e => onBlur?.(e)}
          onChangeText={search => onChange(search)}
        />
      </Animated.View>
    );
  }

}

export default SearchBar;
