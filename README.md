[See types for a detailed description of usage](./index.js)

SwiftList is a component that makes it possible to separate actions (Controller) from UI/UX (View) for large (section) lists with search, selections and actions

- show any data list in any way, with or without sections
- Selection (if activated)
- Search
- Render (list)-headers and -footers
- Render given footer
- pull to refresh
- Either select, show actions, or do action, when clicking on item
- Selection actions
- Section actions

# Usage

```
coming here
```

# API

## Props

| Tools      |
| ---------- |
| navigation |
| dispatch   |

```
type SectionActionsGetter = (
title: SectionTitle,
tools: Tools,
sectionData: Object[]
) => Action[];
```

| SectionTitle: field | type                                           | description                                                                  |
| ------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------- |
| field               | string                                         | on what field is this section based?                                         |
| value               | string \| number \| boolean                    | What is the value of that field of this section? e.g. Amsterdam, 2, or true  |
| title               | (value: string \| number \| boolean) => string | What is the title for this section? E.g. Amsterdam, Friends, or Inner Circle |
| sectionActions      | SectionActionsGetter                           | Which actions are possible on this section? callback                         |
| returnIfEmpty       | (state: State) => boolean                      | function that returns a boolean based on swiftlist state                     |

| Section | type         |
| ------- | ------------ |
| title   | SectionTitle |
| data    | Object[]     |

| Action  | type       |
| ------- | ---------- |
| index   | number     |
| onPress | () => void |
| title   | string     |

```

export type Props = {
  /**
   * won't be rendered
   */
  children: React.ReactNode,

  /**
   * to know wheter or not to add marginTop
   */
  hasHeader: boolean,

  /**
   * provide tools to do sectionActions
   */
  tools: Tools,

  /**
   * extra style for the main view container
   */
  style: any,

  /**
   * you can give either sections or items. make sure every item has an `id` prop, or selection won't work
   */
  data?: Section[] | Object[],

  /**
   * when true, defaults to selectionview and can't stop this.
   */
  isEditing?: boolean,

  /**
   * use search? defaults to true
   */
  useSearch?: boolean,

  /**
   * pull to see header? defaults to false
   */
  pullHeader?: boolean,

  /**
   * defaults to 1
   */
  numColumns?: number,
  /**
   * maps an item to a string that can be searched from that item
   */
  getSearchableString: (item: Object) => string,

  /**
   * maps an item to a string for a title
   */
  getTitle: (item: Object) => string,

  /**
   * maps an item to a string for a subtitle
   */
  getSubtitle: (item: Object) => string,

  /**
   * render the item
   */
  renderItem: (props: any) => any,

  footer?: (state: State) => any,
  topHeader?: (state: State) => any,
  bottomHeader?: (state: State) => any,
  listFooter?: (state: State) => any,
  listHeader?: (state: State) => any,
  listEmpty?: (state: State) => any,
  listEmptySection?: (state: State, title: SectionTitle) => any,

  /**
   * if given, pull to refresh is enabled and will wait for onRefresh to promise. won't work together with pullHeader
   */
  onRefresh?: () => Promise<void>,

  /**
   * callback that retreives actions from parent based on item. This in turn renders ActionSheet or something else. If there's just one action, just fire that action without button
   */
  itemActions: (item: Object) => Action[],

  /**
   * callback that retreives actions from parent based on selection. this in turn renders FAB or something else, depending on optional parameter or platform default
   */
  selectionActions: (selection: Object[]) => Action[],

  /**
   * callback when selection changes
   */
  onChange: (selection: Object[]) => void,

  /**
   * callback when isSearching changes
   */
  isSearching: (isSearching: boolean) => void,

  hideStatusBar: boolean,

  headerButtons: (HeaderIconButton.Props & {
    position: "top" | "bottom" | "left" | "right"
  })[]
};

export type State = {
  search: string,
  isSearching: boolean,
  isEditing: boolean,
  selected: Object[],
  isRefreshing: boolean
};

```
