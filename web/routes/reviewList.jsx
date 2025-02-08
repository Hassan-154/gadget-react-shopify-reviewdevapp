import {
  TextField,
  IndexTable,
  Card,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  ChoiceList,
  RangeSlider,
  Badge,
  IndexFiltersMode,
  useBreakpoints,
  Page,
  Button,
  InlineStack,
  Icon,
} from "@shopify/polaris";
import { useState, useCallback,useEffect } from "react";
import { EditIcon, DeleteIcon } from "@shopify/polaris-icons";
import { useAction, useFindMany } from "@gadgetinc/react";
import { api } from "../api";

function reviewsTable() {

  const [afterCursor, setAfterCursor] = useState(null);
  const [beforeCursor, setBeforeCursor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [pageInfoData, setPageInfoData] = useState(null)
  const pageSize = 20;
  
  const [currentPage, setCurrentPage] = useState(1);
  
  const [searchTableData, setSearchTableData] = useState('');
    const [{ data: reviewListData, fetching: findFetching, error: findError, pageInfo }, _refetch] = useFindMany(api.reviewList, {
        live: true,
        ...(searchTableData ? { search: searchTableData } : {}),
        first: pageSize,
        ...(afterCursor ? { after: afterCursor } : {}),
        ...(beforeCursor ? { before: beforeCursor, last: pageSize } : {}),
        // ...(searchTableData ? { filter: { OR: [{ customerName: { startsWith: searchTableData } }, { reviewTitle: { startsWith: searchTableData } }] } } : {}),
    });

  useEffect(() => {
    if (reviewListData) {
      console.log("New data received:", reviewListData);
      setReviews(reviewListData);
    }
  }, [reviewListData, afterCursor, beforeCursor]);

  // Also add a console log for fetching state
  useEffect(() => {
    if (reviewListData?.pagination) {
        setReviews(reviewListData.pagination.edges.map((edge) => edge.node));
        setPageInfoData(reviewListData.pagination.pageInfo);
    } else {
        console.error("No pagination info or data available");
    }
}, [reviewListData]);
console.log("pageinfoData ...", pageInfoData)

  
const handleNextPage = () => {
  if (pageInfoData?.hasNextPage) {
    setAfterCursor(pageInfoData.endCursor);
    setBeforeCursor(null);
    setCurrentPage((prev) => prev + 1);
}
};

const handlePreviousPage = () => {
  if (pageInfoData?.hasPreviousPage) {
    setBeforeCursor(pageInfoData.startCursor);
    setAfterCursor(null);
    setCurrentPage((prev) => Math.max(prev - 1, 1));
}
};
  
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [itemStrings, setItemStrings] = useState([
    "All",
    "Unpaid",
    "Open",
    "Closed",
    "Local delivery",
    "Local pickup",
  ]);
  const deleteView = (index) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };

  const duplicateView = async (name) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await sleep(1);
    return true;
  };

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: "rename",
              onAction: () => {},
              onPrimaryAction: async (value) => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: "duplicate",
              onPrimaryAction: async (value) => {
                await sleep(1);
                duplicateView(value);
                return true;
              },
            },
            {
              type: "edit",
            },
            {
              type: "delete",
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
  }));
  const [selected, setSelected] = useState(0);
  const onCreateNewView = async (value) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };
  const sortOptions = [
    { label: "Order", value: "order asc", directionLabel: "Ascending" },
    { label: "Order", value: "order desc", directionLabel: "Descending" },
    { label: "Customer", value: "customer asc", directionLabel: "A-Z" },
    { label: "Customer", value: "customer desc", directionLabel: "Z-A" },
    { label: "Date", value: "date asc", directionLabel: "A-Z" },
    { label: "Date", value: "date desc", directionLabel: "Z-A" },
    { label: "Total", value: "total asc", directionLabel: "Ascending" },
    { label: "Total", value: "total desc", directionLabel: "Descending" },
  ];
  const [sortSelected, setSortSelected] = useState(["order asc"]);
  const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);
  const onHandleCancel = () => {};

  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };

  const primaryAction =
    selected === 0
      ? {
          type: "save-as",
          onAction: onCreateNewView,
          disabled: false,
          loading: false,
        }
      : {
          type: "save",
          onAction: onHandleSave,
          disabled: false,
          loading: false,
        };
  const [accountStatus, setAccountStatus] = useState([]);
  const [moneySpent, setMoneySpent] = useState(undefined);
  const [taggedWith, setTaggedWith] = useState("");
  const [queryValue, setQueryValue] = useState(undefined);

  const handleAccountStatusChange = useCallback(
    (value) => setAccountStatus(value),
    []
  );
  const handleMoneySpentChange = useCallback(
    (value) => setMoneySpent(value),
    []
  );
  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    []
  );
  const handleQueryValueChange = useCallback((value) => {
    setQueryValue(value);
    setSearchTableData(value);
  }, []);
  
  const handleAccountStatusRemove = useCallback(() => setAccountStatus([]), []);
  const handleMoneySpentRemove = useCallback(
    () => setMoneySpent(undefined),
    []
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(""), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {
    handleAccountStatusRemove();
    handleMoneySpentRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleQueryValueRemove,
    handleTaggedWithRemove,
    handleMoneySpentRemove,
    handleAccountStatusRemove,
  ]);

  const filters = [
    {
      key: "accountStatus",
      label: "Account status",
      filter: (
        <ChoiceList
          title="Account status"
          titleHidden
          choices={[
            { label: "Enabled", value: "enabled" },
            { label: "Not invited", value: "not invited" },
            { label: "Invited", value: "invited" },
            { label: "Declined", value: "declined" },
          ]}
          selected={accountStatus || []}
          onChange={handleAccountStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
    {
      key: "moneySpent",
      label: "Money spent",
      filter: (
        <RangeSlider
          label="Money spent is between"
          labelHidden
          value={moneySpent || [0, 500]}
          prefix="$"
          output
          min={0}
          max={2000}
          step={1}
          onChange={handleMoneySpentChange}
        />
      ),
    },
  ];

  const appliedFilters =
    taggedWith && !isEmpty(taggedWith)
      ? [
          {
            key: "taggedWith",
            label: disambiguateLabel("taggedWith", taggedWith),
            onRemove: handleTaggedWithRemove,
          },
        ]
      : [];
      

  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(reviews);

  const rowMarkup = reviews?.map(
    (
      { id, reviewTitle, date, customerName, customerEmail, publishStatus, fulfillmentStatus },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
          {reviewTitle.slice(0, 8)}...
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{date}</IndexTable.Cell>
        <IndexTable.Cell><IndexTable.Cell>{customerName}</IndexTable.Cell></IndexTable.Cell>
        <IndexTable.Cell>{customerEmail.slice(0, 8)}...</IndexTable.Cell>
        <IndexTable.Cell>
          { publishStatus ? <Badge progress="complete">Publish</Badge> : <Badge progress="incomplete">Unpublish</Badge>}
          </IndexTable.Cell>
        <IndexTable.Cell>
        <InlineStack gap="200" align="center">
          <Button tone="success">
            <Icon source={EditIcon} />
          </Button>
          <Button tone="critical">  
            <Icon source={DeleteIcon} />
          </Button>
          </InlineStack>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Page
      backAction={{ content: "Settings", url: "/dashboard" }}
      title="Review List"
      primaryAction={
        <Button variant="primary">Create New Customization</Button>
      }
    >
      {/* <pre>{JSON.stringify(reviewListData, null, 2)}</pre> */}
      <Card>
        <IndexFilters
          loading={findFetching}
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          onQueryChange={handleQueryValueChange}
          onQueryClear={() => setQueryValue("")}
          onSort={setSortSelected}
          primaryAction={primaryAction}
          cancelAction={{
            onAction: onHandleCancel,
            disabled: false,
            loading: false,
          }}
          tabs={tabs}
          selected={selected}
          onSelect={setSelected}
          canCreateNewView
          onCreateNewView={onCreateNewView}
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
        />
        <IndexTable
          condensed={useBreakpoints().smDown}
          resourceName={resourceName}
          itemCount={reviews ? reviews.length : 0}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "Review Title" },
            { title: "Date" },
            { title: "Customer Name" },
            { title: "Customer Email" },
            { title: "Status" },
            { title: "Action", alignment: "center" },
          ]}
          pagination={{
            hasNext: pageInfoData?.hasNextPage,
            hasPrevious: pageInfoData?.hasPreviousPage,
            onNext: handleNextPage,
            onPrevious: handlePreviousPage
          }}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
    </Page>
  );

  function disambiguateLabel(key, value) {
    switch (key) {
      case "moneySpent":
        return `Money spent is between $${value[0]} and $${value[1]}`;
      case "taggedWith":
        return `Tagged with ${value}`;
      case "accountStatus":
        return value.map((val) => `Customer ${val}`).join(", ");
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}

export default reviewsTable;
