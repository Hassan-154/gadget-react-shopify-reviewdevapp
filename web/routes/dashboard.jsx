import { Box, Page, Button, LegacyCard, Grid, BlockStack } from "@shopify/polaris";
import { Link } from "react-router";

export default function () {
  return (
   <Page
      backAction={{content: 'Settings', url: '#'}}
      title="Dashboard"
    >
     {/*two cards for the reviewList&questions/answer */}
     <Grid>
        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
          <LegacyCard title="Manage Reviews" sectioned>
            <BlockStack gap="500">
              <p style={{ paddingTop: '6px' }}>Monitor and respond to customer feedback across your product catalog with our comprehensive 
               review management system.</p>
           <Box>
             <Link to="/reviewList"><Button variant="primary">Track Reviews</Button></Link>
           </Box>
            </BlockStack>
          </LegacyCard>
        </Grid.Cell>
        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
          <LegacyCard title="Manage Question&Answer" sectioned>
             <BlockStack gap="500">
                <p style={{ paddingTop: '6px' }}>Engage with customer inquiries and maintain a knowledge base through our centralized question 
                 and answer platform.</p>
           <Box>
             <Link to='/question&Answer'><Button variant="primary">Track Question&Answer</Button></Link>
           </Box>
             </BlockStack>
          </LegacyCard>
        </Grid.Cell>
      </Grid>
    </Page>
  );
}
