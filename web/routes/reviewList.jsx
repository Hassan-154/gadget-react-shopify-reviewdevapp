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
  Modal,
  Frame,
  Spinner,
} from "@shopify/polaris";
import { useNavigate } from "react-router";
import { useState, useCallback, useEffect } from "react";
import { EditIcon, DeleteIcon } from "@shopify/polaris-icons";
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";

function reviewsTable() {
  const [afterCursor, setAfterCursor] = useState(null);
  const [beforeCursor, setBeforeCursor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [pageInfoData, setPageInfoData] = useState(null);
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortSelected, setSortSelected] = useState(["customerName asc"]);
  const [fieldDB, sortOrder] = sortSelected[0].split(" ");
  const [searchTableData, setSearchTableData] = useState("");
  const [tableSpinnerToDataLoad, setTableSpinnerToDataLoad] = useState(false);
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(reviews);
    const navigate = useNavigate();
  const [
    {
      data: reviewListData,
      fetching: findFetching,
      error: findError,
      pageInfo,
    },
    _refetch,
  ] = useFindMany(api.reviewList, {
    live: true,
    ...(searchTableData ? { search: searchTableData } : {}),
    first: pageSize,
    ...(afterCursor ? { after: afterCursor } : {}),
    ...(beforeCursor ? { before: beforeCursor, last: pageSize } : {}),
    sort: { [fieldDB]: sortOrder === "asc" ? "Ascending" : "Descending" },
  });
  
  const updateReviewStatus = async (ids, value) => {
    try {
      setTableSpinnerToDataLoad(true);
      for (const id of ids) {
        await api.reviewList.update(id, { publishStatus: value });
      }
      _refetch();
      handleSelectionChange("all", false);
    } catch (error) {
    }
    finally {
      setTableSpinnerToDataLoad(false);
    }
  };

  const deleteReviews = async (idsToDelete) => {
    try {
      setTableSpinnerToDataLoad(true);
      for (const id of idsToDelete) {
        await api.reviewList.delete(id);
      }
      _refetch();
      handleSelectionChange("all", false);
    } catch (error) {
    } finally {
      setTableSpinnerToDataLoad(false);
    }
  };

  useEffect(() => {
    if (reviewListData) {
      setReviews(reviewListData);
    }
  }, [reviewListData, afterCursor, beforeCursor]);

  useEffect(() => {
    if (reviewListData?.pagination) {
      const newReviews = reviewListData.pagination.edges.map(
        (edge) => edge.node
      );
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

  const [active, setActive] = useState(false);

  const toggleModal = useCallback(() => setActive((active) => !active), []);

  const sortOptions = [
    {
      label: "Customer Name",
      value: "customerName asc",
      directionLabel: "A-Z",
    },
    {
      label: "Customer Name",
      value: "customerName desc",
      directionLabel: "Z-A",
    },
    { label: "Date", value: "createdAt asc", directionLabel: "Ascending" },
    { label: "Date", value: "createdAt desc", directionLabel: "Descending" },
  ];
  const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);

  const [queryValue, setQueryValue] = useState(undefined);

  const handleQueryValueChange = useCallback((value) => {
    setQueryValue(value);
    setSearchTableData(value);
    setAfterCursor(null);
    setBeforeCursor(null);
    setCurrentPage(1);
  }, []);

  const handleQueryValueRemove = useCallback(() => {
    setQueryValue("");
    setSearchTableData("");
    setAfterCursor(null);
    setBeforeCursor(null);
    setCurrentPage(1);
  }, []);

  const handleFiltersClearAll = useCallback(() => {
    handleQueryValueRemove();
  }, [handleQueryValueRemove]);

  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const rowMarkup = reviews?.map(
    (
      {
        id,
        reviewTitle,
        productId,
        createdAt,
        customerName,
        customerEmail,
        publishStatus,
      },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
        onClick={(event) => {
          navigate(`/review/${id}`);
          // navigate(`/review/${id}`, { replace: true });
          event.stopPropagation();
          event.preventDefault(); 
        }}
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
        <IndexTable.Cell>
          {new Date(createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {productId}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <IndexTable.Cell>{customerName}</IndexTable.Cell>
        </IndexTable.Cell>
        <IndexTable.Cell>{customerEmail.slice(0, 16)}...</IndexTable.Cell>
        <IndexTable.Cell>
          {publishStatus ? (
            <Badge progress="complete">Publish</Badge>
          ) : (
            <Badge progress="incomplete">Unpublish</Badge>
          )}
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
      backAction={{ content: "Products", url: "#" }}
      title="Review List"
      compactTitle
      primaryAction={{
        content: "Create new review",
        disabled: false,
        variant: "primary",
      }}
    >
      {/* <pre>{JSON.stringify(reviewListData, null, 2)}</pre> */}
      {tableSpinnerToDataLoad && (
        <div>
          <div
            style={{
              position: "fixed",
              inset: "0px",
              backgroundColor: "rgba(255,255,255,0.7)",
              zIndex: "999",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spinner size="large" />
          </div>
        </div>
      )}
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
          primaryActionButton={<Badge progress="complete">Publish</Badge>}
          appliedFilters={[]}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
        />
        <IndexTable
          emptyState={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
              <Spinner accessibilityLabel="Spinner example" size="large" />
            </div>
          }
          condensed={useBreakpoints().smDown}
          resourceName={resourceName}
          itemCount={reviews ? reviews.length : 0}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          promotedBulkActions={[
            {
              content: 'Delete selected reviews',
              onAction: () => toggleModal(),
            },
            {
              title: 'Publish Status',
              actions: [
                {
                  content: 'Publish',
                  onAction: () =>  updateReviewStatus(selectedResources, true),
                },
                {
                  content: 'Unpublish',
                  onAction: () => updateReviewStatus(selectedResources, false),
                },
              ],
            },
          ]}
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
            onPrevious: handlePreviousPage,
          }}
        >
          {rowMarkup}
        </IndexTable>
      </Card>

      <Frame>
        <div style={{ height: "500px" }}>
          <Modal
            open={active}
            onClose={toggleModal}
            title="Delete customization"
            primaryAction={{
              destructive: true,
              content: "Delete",
              onAction: () => {
                deleteReviews(selectedResources);
                toggleModal();
              },
            }}
            secondaryActions={[
              {
                content: "Cancel",
                onAction: toggleModal,
              },
            ]}
          >
            <Modal.Section>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                <Text variant="headingSm" as="h6">
                  Are you sure you want to delete this Customization <br />
                  "Review List Module"
                </Text>
              </div>
            </Modal.Section>
          </Modal>
        </div>
      </Frame>
    </Page>
  );
}

export default reviewsTable;
