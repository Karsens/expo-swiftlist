//external

import React from "react";
import {
  AppState,
  FlatList,
  SectionList,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";

import KeyboardSpacer from "react-native-keyboard-spacer";
import { BlurView } from "expo-blur";

import * as Icon from "@expo/vector-icons";

import { Navigation, Dispatch } from "../types";
import { connectActionSheet, SearchBar, FAB } from "../index.leckr.imports";

import * as HeaderIconButton from "../expo-elements/ui.header.icon.button";

// internal

export type Tools = {
  navigation: Navigation,
  dispatch: Dispatch
};

type SectionActionsGetter = (
  title: SectionTitle,
  tools: Tools,
  sectionData: Object[]
) => Action[];

export type SectionTitle = {
  /**
   * on what field is this section based? e.g. contactAmount
   */
  field: string,

  /**
   * What is the value of that field of this section? e.g. Amsterdam, 2, or true
   */
  value: string | number | boolean,

  /**
   * What is the title for this section? E.g. Amsterdam, Friends, or Inner Circle
   */
  title: (value: string | number | boolean) => string,

  /**
   * Which actions are possible on this section? callback
   */
  sectionActions: SectionActionsGetter,

  /**
   * function that returns a boolean based on swiftlist state
   */
  returnIfEmpty: (state: State) => boolean
};

export type Section = {
  title: SectionTitle,
  data: Object[]
};

export type Action = {
  index: number,
  onPress: () => void,
  title: string
};

/**
 * #toRemember: A JSDoc for a prop is always useful because sometimes you don't know if a prop exists, so just write something.
 */
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

/**
 * gets a section based on some things
 */
export const getSection = ({
  items,
  field,
  value,
  filter,
  title,
  sectionActions,
  returnIfEmpty
}: {
  /**
   * all items in the whole list
   */
  items: any[],
  /**
   * the field in the item to check on. Required
   */
  field: string,
  /**
   * the value of that field (needed if no filter or if there are actions)
   */
  value?: any,
  /**
   * sometimes there is no exact field, then you can put a filter here
   */
  filter?: (item: any) => boolean,
  /**
   * title appearing in as sectiontitle and maybe more places
   */
  title: string,

  /**
   * Which actions are possible on this section? callback
   *
   * NB: I DON"T KNOW THE TYPE !!!111!
   */
  sectionActions: SectionActionsGetter,

  /**
   * return if empty or not
   */
  returnIfEmpty: (state: State) => boolean
}): Section => {
  const aFilter = filter || (i => i[field] === value);
  const data = items.filter(aFilter);
  return {
    title: {
      title,
      field,
      value,
      sectionActions,
      returnIfEmpty
    },
    data
  };
};

/**
 * 
 * 
 * 
 * #bug:
 *
 * (node:80147) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 change listeners added. Use emitter.setMaxListeners() to increase limit
 *
 * #bug2
 * VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. Object {
  "contentLength": 2079,
  "dt": 570,
  "prevDt": 638,
}

 * --------#idea Animated BlurView for when Searching or changing view or other §/filters--------------
 *
 * It's not important, but it's not that pretty when the search bar and categories are always visible.
 * With https://docs.expo.io/versions/latest/sdk/blur-view/ (see Animation example) we can build the same effect of getting the search bar of the iPhone homescreen (of newer iOS versions). This is epic!
 *
 * How does this not intervere with the scrollView and pull to refresh?
 * 1) Pull to refresh is not really important anyway and implemented badly in react native. Remove pull to refresh
 * 2) Somehow accurately measure swipe down on the view wrapper, but only do something with it if the childscrollview is on top when starting the movement already.
 *
 * Now that I think of it, this must be implemented before in react native using expo. Maybe I can find a script
 *
 * This is close! Can definitely be used.
 * https://blog.expo.io/implementation-complex-animation-in-react-native-by-example-search-bar-with-tab-view-and-collapsing-68bb43be2dcb
 *
 * #idea in the future, you could even do cool things when swiping a lot to the left or the right. Hide things there, or whatever.
 * 
 * 
 * #idea: Abstrahere contacts from this (strip contacts away and add them in a wrapper around this) because this is a very common pattern and can be used in other cases as well. The ux can be put inside leckr-inputs or expo-elements or so. It's applicable everywhere. However, it seems a bit quick to do this now already. I don't even know yet if this is going to be useful as a contact sectionlist component, and it's very tightly coupled with UI. It'll be an interesting thing to try, and I can probably learn a lot from it, but let's do it step by step, and keep this a ContactsSectionList

 * Responsibilities: Mostly typed UI. Doesn't know what to do. Just does it.
 * 
 * - show any contacts in any way, with or without sections
 * - Selection (if activated)
 * - Search `"pull", "show", "disable"`
 * - Pull to refresh
 * - Render (list)-headers and -footers
 * - Render given footer

 * - Either select, show actions, or do action, when clicking on contact
 * #toRemember
 *
 * Seeing all props in the render and spreading them there to submethods can be a great way to see if a class can be broken up
 *
 * Unfortunately, IntelliSense doesn't understand types when given to functions. This is a big problem for this method, since this gives a huge overhead in boilerplate. Therefore, just keep them here (but don't use them).
 *
 * This isnt'perfect, #toSearch
 *    
 */

@connectActionSheet
class SwiftList extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isSearching: false,
      isEditing: props.isEditing,
      selected: [],
      isRefreshing: false
    };
  }

  /**
   * NB: Appstate is needed for a keyboard bug. Spacer will otherwise be shown if keyboard is open inside an other app (on IOS)
   */
  async componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);
    this.handleAppStateChange("active");
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  handleAppStateChange = appState => {
    this.setState({ appState });
  };

  onRefresh() {
    this.setState({ isRefreshing: true }, async () => {
      await this.props.onRefresh?.();
      this.setState({ isRefreshing: false });
    });
  }

  isAlreadySelected(item) {
    const { selected } = this.state;
    const ids = selected ? selected.map(s => s.id) : [];
    const already = ids.includes(item.id);
    return already;
  }

  switchSelection = item => {
    const { onChange, isEditing } = this.props;
    const { selected } = this.state;

    let newSelected = selected;

    if (this.isAlreadySelected(item)) {
      newSelected = selected.filter(s => s.id !== item.id);
    } else {
      newSelected.push(item);
    }

    const isAnySelectedStill = newSelected.length > 0;

    this.setState({
      selected: newSelected,
      isEditing: isAnySelectedStill || isEditing
    });
    onChange?.(newSelected);
  };

  renderHeader = () => {
    const { topHeader, bottomHeader, headerButtons, useSearch } = this.props;

    const renderButtons = (pos, extraProps) =>
      headerButtons
        ?.filter(b => b.position === pos)
        ?.map(({ position, ...button }) => (
          <HeaderIconButton.Component
            key={button.key}
            {...button}
            {...extraProps}
            state={this.state}
          />
        ));

    return (
      <View>
        {topHeader?.(this.state)}

        <View>
          <View
            style={{
              flexDirection: "row",
              // alignItems: "space-between",
              justifyContent: "space-between"
            }}
          >
            {renderButtons("top")}
          </View>
          <View
            style={{
              flexDirection: "row",
              // alignItems: "space-between",
              justifyContent: "space-between",
              marginVertical: 10
            }}
          >
            {renderButtons("left")}

            {/* #hooks for searchbar state?  */}
            <View style={{ flex: 1 }}>
              {useSearch !== false && (
                <SearchBar
                  reference={ref => (this.searchBar = ref)}
                  onFocus={() => this.setState({ isSearching: true })}
                  onBlur={() => {
                    this.setState({ isSearching: false });
                    this.props.isSearching?.(false);
                  }}
                  onChange={search => {
                    this.setState({ search });

                    if (search === "") {
                      this.setState({ isSearching: false });
                      this.props.isSearching?.(false);
                    }
                    if (search) {
                      this.setState({ isSearching: true });

                      this.props.isSearching?.(true);
                    }
                  }}
                />
              )}
            </View>

            {renderButtons("right", { style: { marginRight: 7 } })}
          </View>

          <View
            style={{
              flexDirection: "row",
              // alignItems: "space-between",
              justifyContent: "space-between"
            }}
          >
            {renderButtons("bottom")}
          </View>
        </View>

        {bottomHeader?.(this.state)}
      </View>
    );
  };

  renderFooter = () => {
    const { footer, selectionActions, onChange } = this.props;
    const { selected, appState } = this.state;

    const appInForeground = appState === "active";
    const actions = selectionActions?.(selected);

    const renderFAB =
      selected.length > 0 && actions?.length > 0 ? (
        <View>
          <FAB
            backgroundColor={"#CCC"}
            icon={"share"}
            IconFont={Icon.FontAwesome}
            iconColor={"#000"}
            onPress={() => {
              const extraConfig = {
                title: `With ${selected.length} selected...`
              };

              const actionsAndCancel = actions;
              actionsAndCancel.push({
                title: "Cancel",
                cancel: true
              });

              const indexAction = index => {
                actionsAndCancel[index]?.onPress?.();
              };
              this.props.showActionSheetWithOptions(
                {
                  options: actionsAndCancel.map(option => option.title),
                  cancelButtonIndex: actionsAndCancel.length - 1,
                  title: "Choose what you want to see"
                },
                indexAction
              );

              this.setState({ selected: [], isEditing: false });
              onChange?.([]);
            }}
          />
        </View>
      ) : null;

    return (
      <View>
        {footer}
        {renderFAB}
        {/* #toTest iPhone X, is -48 enough? */}
        {appInForeground && <KeyboardSpacer topSpacing={-48} />}
      </View>
    );
  };

  renderSectionHeader = ({
    section: { title, data }
  }: {
    section: Section
  }) => {
    const { showActionSheetWithOptions, listEmptySection, tools } = this.props;

    const { sectionActions, ...titleWithoutSectionActions } = title;

    const sActions =
      sectionActions?.(titleWithoutSectionActions, tools, data) || [];
    const actions = sActions.concat([{ title: "Cancel", cancel: true }]);

    return (
      <View>
        <View
          style={{
            width: "100%",
            backgroundColor: "#EEE",
            borderTopColor: "#CCC",
            borderTopWidth: 0.5,
            padding: 6,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{title.title}</Text>

          {actions.length > 1 && (
            <TouchableOpacity
              onPress={() => {
                const indexAction = index => {
                  actions[index]?.onPress?.();
                };
                this.props.showActionSheetWithOptions(
                  {
                    options: actions.map(option => option.title),
                    title: title.title,
                    cancelButtonIndex: actions.length - 1,
                    message: "Do something with " + title.title
                  },
                  indexAction
                );
              }}
            >
              <Icon.Feather name="more-vertical" size={20} color="black" />
            </TouchableOpacity>
          )}
        </View>

        {data.length === 0 && listEmptySection?.(this.state, title)}
      </View>
    );
  };

  searchItems(searchQuery: string, objectArray: Object[]) {
    const { getSearchableString } = this.props;
    return SearchBar.searchFilter({
      objectArray,
      searchableStringArray: objectArray.map(i => getSearchableString(i)),
      searchQuery
    });
  }

  isSectionArray = data => {
    const dataKeys = data && data[0] && Object.keys(data[0]);
    return (
      dataKeys &&
      dataKeys.includes("title") &&
      dataKeys.includes("data") &&
      dataKeys.length === 2
    );
  };

  /**
   * gets and searches through data, returns section[] or item[], same what it gets in.
   */
  getData() {
    const {
      props: { data },
      state
    } = this;

    if (this.isSectionArray(data)) {
      return data
        .map(({ title, data }) => ({
          title,
          data: this.searchItems(state.search, data)
        }))
        .filter(({ title, data }: Section) => {
          const hasItems = data.length > 0;
          const shouldShow = hasItems || title.returnIfEmpty?.(state);
          return shouldShow;
        });
    } else {
      return this.searchItems(state.search, data);
    }
  }

  /**
   * renders either a flatlist or sectionlist based on the data
   */
  renderList() {
    const {
      props: { data, onRefresh, useSearch },
      state: { isRefreshing, selected, isEditing, search }
    } = this;

    const refreshProps = onRefresh && {
      onRefresh: () => this.onRefresh(),
      refreshing: isRefreshing
    };

    let List = FlatList;

    let props = {
      data: this.getData()
    };
    if (this.isSectionArray(data)) {
      List = SectionList;
      props = {
        sections: this.getData(),
        renderSectionHeader: this.renderSectionHeader
      };
    }

    return (
      <List
        {...props}
        extraData={[selected.length, isEditing, search]}
        keyExtractor={(item, index) => `${item.id}item${index}`}
        renderItem={props => this.renderRowOrNothing(props)}
        keyboardShouldPersistTaps={"handled"}
        onScroll={
          !onRefresh && useSearch !== false
            ? e => this.searchIfPull(e)
            : undefined
        }
        {...refreshProps}
        ListEmptyComponent={() => this.props.listEmpty?.(this.state) || null}
        ListHeaderComponent={() => this.props.listHeader?.(this.state) || null}
        ListFooterComponent={() => this.props.listFooter?.(this.state) || null}
      />
    );
  }

  searchIfPull(e) {
    const y = e.nativeEvent.contentOffset.y;
    if (y < -80) {
      this.searchBar.focus();
    }
  }

  renderRowOrNothing = ({ item, index, section, separators }) => {
    // NB: Flatlist has no section and nothing else!

    const { numColumns, data } = this.props;

    if (!numColumns || numColumns === 1) {
      return this.renderItem({ item, index });
    }

    if (index % numColumns !== 0) {
      return null;
    }

    // only the first of a row!

    const items = [];

    let d = data;
    if (this.isSectionArray(data)) {
      d = section.data;
    }

    for (let i = index; i < index + numColumns; i++) {
      if (i >= d.length) {
        break;
      }

      const item = d[i];
      items.push(this.renderItem({ item, index: i }));
    }

    return (
      <View key={`index-${index}`} style={{ flexDirection: "row" }}>
        {items}
      </View>
    );
  };

  renderItem({ item, index }) {
    const {
      showActionSheetWithOptions,
      itemActions,
      getTitle,
      getSubtitle
    } = this.props;

    const { isEditing } = this.state;

    const actions: Action[] = itemActions?.(item) || [];

    actions.push({
      title: "Select",
      onPress: () => {
        this.setState({ isEditing: true });
        this.switchSelection(item);
      }
    });

    actions.push({ title: "Cancel", cancel: true });

    const moreActions = actions.length > 1;
    const oneAction = actions.length === 1;

    const indexAction = index => actions[index]?.onPress?.();
    const userAction = () => {
      moreActions &&
        showActionSheetWithOptions(
          {
            options: actions.map(a => a.title),
            title: getTitle(item),
            cancelButtonIndex: actions.length - 1,
            message: getSubtitle(item)
          },
          indexAction
        );
      oneAction && actions[0].onPress();
    };

    return (
      <View key={`key-${index}`}>
        <TouchableOpacity
          onLongPress={() => {
            this.setState({ isEditing: true });
            this.switchSelection(item);
          }}
          onPress={isEditing ? () => this.switchSelection(item) : userAction}
        >
          {this.props.renderItem({ item, index })}
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { hideStatusBar, style, hasHeader } = this.props;
    const { isSearching, search } = this.state;

    return (
      <View
        style={[
          { flex: 1, marginTop: isIphoneX() && !hasHeader ? 28 : 0 },
          style
        ]}
      >
        {hideStatusBar && <StatusBar hidden />}

        {this.renderHeader()}

        <BlurViewWrapper
          onStopBlur={() => {
            this.searchBar.blur();
          }}
          slowBlur={isSearching && !search}
        >
          {this.renderList()}
        </BlurViewWrapper>

        {this.renderFooter()}
      </View>
    );
  }
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const FADE_MS = 500;
//leckr
class BlurViewWrapper extends React.Component {
  state = {
    intensity: new Animated.Value(0)
  };

  componentDidUpdate() {
    const { slowBlur } = this.props;
    let { intensity } = this.state;

    if (slowBlur) {
      Animated.timing(intensity, { duration: FADE_MS, toValue: 90 }).start(
        () => {
          //niks erna
        }
      );
    } else {
      Animated.timing(intensity, { duration: FADE_MS, toValue: 0 }).start();
      //rustahhg
    }
  }

  render() {
    const { children, slowBlur, onStopBlur } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {children}
        {slowBlur && (
          <TouchableWithoutFeedback onPress={() => onStopBlur()}>
            <AnimatedBlurView
              tint="light"
              intensity={this.state.intensity}
              style={StyleSheet.absoluteFill}
            />
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}

export { SwiftList };
