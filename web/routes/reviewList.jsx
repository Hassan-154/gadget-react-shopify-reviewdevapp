import {
  IndexTable,
  Card,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
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
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";

function reviewsTable() {

  const [afterCursor, setAfterCursor] = useState(null);
  const [beforeCursor, setBeforeCursor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [pageInfoData, setPageInfoData] = useState(null)
  const pageSize = 5;
  
  const [currentPage, setCurrentPage] = useState(1);

  const [sortSelected, setSortSelected] = useState(["customerName asc"]);
  const [fieldDB, sortOrder] = sortSelected[0].split(" ");
  const [searchTableData, setSearchTableData] = useState('');
  const [{ data: reviewListData, fetching: findFetching, error: findError, pageInfo }, _refetch] = useFindMany(api.reviewList, {
    live: true,
    ...(searchTableData ? { search: searchTableData } : {}),
    first: pageSize,
    ...(afterCursor ? { after: afterCursor } : {}),
    ...(beforeCursor ? { before: beforeCursor, last: pageSize } : {}),
    sort: {[fieldDB]: sortOrder === 'asc' ? "Ascending" : "Descending"},
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
        const newReviews = reviewListData.pagination.edges.map((edge) => edge.node);
        setReviews(newReviews);
        setPageInfoData(reviewListData.pagination.pageInfo);
    }
}, [reviewListData]);
  
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
  
  const sortOptions = [
    { label: "Customer Name", value: "customerName asc", directionLabel: "A-Z" },
    { label: "Customer Name", value: "customerName desc", directionLabel: "Z-A" },
    { label: "Date", value: "createdAt asc", directionLabel: "Ascending" },
    { label: "Date", value: "createdAt desc", directionLabel: "Descending" },
  ];
  const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);

  const [queryValue, setQueryValue] = useState(undefined);

  const handleQueryValueChange = useCallback((value) => {
    setQueryValue(value);
    setSearchTableData(value);
    // Reset pagination state when search changes
    setAfterCursor(null);
    setBeforeCursor(null);
    setCurrentPage(1);
}, []);
  
  const handleQueryValueRemove = useCallback(() => {
    setQueryValue("");
    setSearchTableData("");
    // Reset pagination when search is cleared
    setAfterCursor(null);
    setBeforeCursor(null);
    setCurrentPage(1);
}, []);

  const handleFiltersClearAll = useCallback(() => {
    handleQueryValueRemove();
  }, [
    handleQueryValueRemove,
  ]); 
      
  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(reviews);

  const rowMarkup = reviews?.map(
    (
      { id, reviewTitle, productId, createdAt, customerName, customerEmail, publishStatus, fulfillmentStatus },
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
          {id}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
          {reviewTitle.slice(0, 8)}...
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{new Date(createdAt).toLocaleDateString("en-US", {
         year: "numeric",
         month: "long",
         day: "numeric"
         })}
         </IndexTable.Cell>
          <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
          {productId}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell><IndexTable.Cell>{customerName}</IndexTable.Cell></IndexTable.Cell>
        <IndexTable.Cell>{customerEmail.slice(0, 16)}...</IndexTable.Cell>
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
          tabs={[]}
          selected={[]}
          onSelect={[]}
          canCreateNewView
          onCreateNewView={[]}
          filters={[]}
          appliedFilters={[]}
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
            { title: "Review Id" },
            { title: "Review Title" },
            { title: "Date" },
            { title: "Product Id" },
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
}

export default reviewsTable;
