import {
    Box,
    Button,
    Flex,

    Text,
    Divider,
    Toggle,
    TabsContext,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Icon,
    IconButton,
    TextField,
    Chips,
    TextArea,
} from "@vibe/core";
import { Mobile } from "@vibe/icons";
import './CustomerEmailTemplate.css'
import { useState } from "react";

export default function EmailTemplatePreview() {
    const [isMobile, setIsMobile] = useState(false)
    const [iseditTemaplate, setIseditTemplate] = useState(false)

    const [subject, setSubject] = useState(
        "Your order {{ order.name }} has been updated"
    );

    const [body, setBody] = useState(
        `<h2>Order Updated</h2>
<p>Hi {{ custom.first_name }},</p>
<p>{{ shop.name }}</p>`
    );

    const variables = [
        "{{ shop.name }}",
        "{{ custom.first_name }}",
        "{{ order.name }}",
        "{{ order_status_url }}",
        "{{ line_items }}",
        "{{ shop.email }}"
    ];
    return (
        <Box
            style={{
                background: "#ffffff",
            }}
        >

            <Box style={{display:"flex", flexDirection:"column", gap:"16px"}}>

                 {/* Header */}
            <Box padding={16}>
                <Text weight="bold" size="medium">
                    Customer Email Templates
                </Text>
            </Box>




            <Box>
                <Box border borderColor="#C3C6D4"
                    style={{
                        flex: 1,
                        height: "100%",
                        // background: "#ECEFF8",
                        borderRadius: "4px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* TABS */}
                    <TabsContext id="overview-tabs">
                        <TabList id="overview-tab-list" className="tablist-cet" >
                            <Tab id="overview-tab-first">
                                Order Edit
                            </Tab>
                            <Tab id="overview-tab-second">
                                Payment Pending
                            </Tab>
                            <Tab id="overview-tab-third">
                                Order Cancellation
                            </Tab>
                            <Tab id="overview-tab-fourth">
                                Add Upsell Item
                            </Tab>
                            <Tab id="overview-tab-fifth">
                                Orders Edits Time Frame
                            </Tab>
                        </TabList>
                        <TabPanels id="overview-tab-panels">
                            <TabPanel id="overview-panel-first" className="tabpanel-cet">
                                <Box

                                    // padding="medium"
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        padding: "20px 40px 20px 40px",
                                        backgroundColor: "#ffffff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    {iseditTemaplate ? (<>
                                        <Box border
                                            style={{
                                                maxWidth: '750px',
                                                width: "100%",

                                                height: "auto",
                                                background: "#E7E9EF",
                                                // padding:"10px 8px",
                                                boxShadow: "none",
                                                borderRadius: "4px"
                                            }}>

                                            {/* TOP BAR */}
                                          <Box>
                                              <Flex justify="space-between"  style={{ padding: "10px" }}>
                                                <Flex gap={16} >
                                                    <Text weight="medium" type="text1">Edit Template</Text>

                                                    {/* <Box  style={{backgroundColor:"#ffffff", padding:"2px 8px 2px 8px"}}> */}
                                                        {/* <Text active>Order Edit</Text> */}
                                                        <Chips  label="Order Edit" readOnly color="explosive" className="fdfdf" />
                                                    {/* </Box> */}
                                                </Flex>

                                                <Flex gap={8}>
                                                    <Button size="small" kind="tertiary">Reset to default</Button>
                                                    <Button size="small" kind="secondary" onClick={() => setIseditTemplate(false)}>Cancel</Button>
                                                    <Button size="small" kind="primary">Save</Button>
                                                </Flex>
                                            </Flex>
                                          </Box>

                                            <Divider withoutMargin />

                                            {/* MAIN CONTENT */}
                                            <Flex >
                                                {/* LEFT SIDE */}
                                                <Box style={{width:"70%", backgroundColor:"#ffffff", padding:"18px", height:"100%"}} flex={1}>
                                                    <Flex direction="column" align="start" gap={12}>
                                                       <Box style={{width:"100%"}}>
                                                         <Text weight="bold">
                                                        Email Subject
                                                    </Text>

                                                    <TextField
                                                        value={subject}
                                                        onChange={(value) => setSubject(value)}
                                                        placeholder="Email Subject"
                                                    />

                                                       </Box>
                                                    <Box style={{width:"100%"}}>
                                                        <Text weight="bold"  >
                                                        Email Body (HTML / Liquid)
                                                    </Text>

                                                    <TextArea
                                                        style={{backgroundColor:"#ECEFF8"}}
                                                        multiline
                                                        rows={12}
                                                        value={body}
                                                        onChange={(value) => setBody(value)}
                                                        placeholder="Write email HTML here"
                                                    />
                                                    </Box>
                                                    </Flex>
                                                </Box>

                                                {/* RIGHT SIDE */}
                                                <Box
                                                 style={{width:"30%", height:"-webkit-fill-available", padding:"10px"}} 
                                                  border >

                                                   <Flex direction="column" gap={10} align="start">
                                                     <Text weight="bold" >
                                                        Available Variables
                                                    </Text>

                                                    <Flex direction="column" gap={8} align="start">
                                                        {variables.map((item) => (
                                                            <Button
                                                                key={item}
                                                                kind="secondary"
                                                                size="small"
                                                                onClick={() => setBody((prev) => prev + " " + item)}
                                                            >
                                                                {item}
                                                            </Button>
                                                        ))}
                                                    </Flex>

                                                    <Text size="small" color="secondary" >
                                                        Click a variable to insert it into the editor at the cursor position.
                                                    </Text>
                                                   </Flex>
                                                </Box>
                                            </Flex>
                                        </Box>
                                    </>
                                    ) : (<>

                                        <Box border
                                            style={{
                                                maxWidth: '750px',
                                                width: "100%",

                                                height: "auto",
                                                background: "#E7E9EF",
                                                // padding:"10px 8px",
                                                boxShadow: "none",
                                                borderRadius: "4px"
                                            }}
                                        >



                                            <Box border style={{ padding: "6px" }} >

                                                <Flex justify="space-between" align="center" >
                                                    <Text weight="bold">Preview</Text>

                                                  <Box style={{display:"flex", gap:"5px"}}>
                                                      <Flex  style={{ backgroundColor: "#ffffff", padding: "4px" }} gap={5} justify="center">

                                                        <IconButton

                                                            ariaLabel="Add"
                                                            icon={Mobile}
                                                            size="xs"
                                                            onClick={() => setIsMobile(true)}
                                                        />
                                                        <span style={{ fontSize: 12, cursor: "pointer", font: "14px" }} onClick={() => setIsMobile(true)}>Desktop</span>

                                                        <div style={{ width: 1, height: 24, backgroundColor: "#888686ff" }} />


                                                        <IconButton
                                                            color="inverted"
                                                            size="xs"
                                                            ariaLabel="Add"
                                                            icon={Mobile}
                                                            onClick={() => setIsMobile(false)}
                                                        />
                                                        <span style={{ fontSize: 12, cursor: "pointer", font: "12px" }} onClick={() => setIsMobile(false)}>Mobile</span>

                                                    </Flex>
                                                        <Button size="small" onClick={() => setIseditTemplate(true)}>Edit Template</Button>

                                                  </Box>

                                                </Flex>
                                            </Box>
                                            <Box style={{ padding: "40px" }}>

                                                <Flex justify="center">
                                                    {isMobile ? (<><Box border
                                                        style={{
                                                            width: "500px",
                                                            height: "auto",
                                                            background: "#ffffff",
                                                            border: "1px solid #E6E9EF",
                                                            padding: "16px",
                                                            borderRadius: "4px"
                                                        }}
                                                    >
                                                        <Text size="small" color="secondary">
                                                            Subject
                                                        </Text>
                                                        <Text weight="bold" marginBottom={12}>
                                                            Your order {`{{ order.name }}`} has been updated
                                                        </Text>

                                                        <Divider />

                                                        <Text weight="bold" >
                                                            Order Updated
                                                        </Text>

                                                        <Text size="small">
                                                            Hi {`{{ customer.first_name }}`},
                                                        </Text>

                                                        <Text size="small">
                                                            You have successfully edited your order. Here are the updated
                                                            details:
                                                        </Text>

                                                        <Text size="small" >
                                                            <b>Order:</b> {`{{ order.name }}`}
                                                        </Text>

                                                        <Text size="small">
                                                            We are preparing your items for shipment.
                                                        </Text>

                                                        <Text
                                                            size="small"

                                                            style={{ color: "#1F76C2", cursor: "pointer" }}
                                                        >
                                                            View Order Status
                                                        </Text>

                                                        <Text size="small" >
                                                            Thanks,
                                                        </Text>
                                                        <Text size="small">{`{{ shop.name }}`}</Text>
                                                    </Box></>) : (<><Box border
                                                        style={{
                                                            width: "280px",
                                                            height: "auto",
                                                            background: "#ffffff",
                                                            border: "1px solid #E6E9EF",
                                                            padding: "16px",
                                                            borderRadius: "4px"
                                                        }}
                                                    >
                                                        <Text size="small" color="secondary">
                                                            Subject
                                                        </Text>
                                                        <Text weight="bold" marginBottom={12}>
                                                            Your order {`{{ order.name }}`} has been updated
                                                        </Text>

                                                        <Divider />

                                                        <Text weight="bold" >
                                                            Order Updated
                                                        </Text>

                                                        <Text size="small">
                                                            Hi {`{{ customer.first_name }}`},
                                                        </Text>

                                                        <Text size="small">
                                                            You have successfully edited your order. Here are the updated
                                                            details:
                                                        </Text>

                                                        <Text size="small" >
                                                            <b>Order:</b> {`{{ order.name }}`}
                                                        </Text>

                                                        <Text size="small">
                                                            We are preparing your items for shipment.
                                                        </Text>

                                                        <Text
                                                            size="small"

                                                            style={{ color: "#1F76C2", cursor: "pointer" }}
                                                        >
                                                            View Order Status
                                                        </Text>

                                                        <Text size="small" >
                                                            Thanks,
                                                        </Text>
                                                        <Text size="small">{`{{ shop.name }}`}</Text>
                                                    </Box></>)}





                                                </Flex>
                                            </Box>

                                        </Box>
                                    </>)}
                                </Box>

                            </TabPanel>
                            <TabPanel id="overview-panel-second">
                                <Box

                                    // padding="medium"
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        padding: "20px 40px 20px 40px",
                                        backgroundColor: "#ffffff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >

                                    <Box border
                                        style={{
                                            maxWidth: '750px',
                                            width: "100%",

                                            height: "auto",
                                            background: "#E7E9EF",
                                            // padding:"10px 8px",
                                            boxShadow: "none",
                                            borderRadius: "4px"
                                        }}
                                    >
                                        <Box border style={{ padding: "6px" }} >
                                            <Flex justify="space-between" align="center" >
                                                <Text weight="bold">Preview</Text>

                                                <Flex gap={8} align="center">
                                                    <Button>Hello</Button>
                                                    <Button size="small">Edit Template</Button>
                                                </Flex>
                                            </Flex>
                                        </Box>
                                        <Box style={{ padding: "40px" }}>

                                            <Flex justify="center">
                                                {/* <Box border
                                                    style={{
                                                        width: "500px",
                                                        height:"auto",
                                                        background: "#ffffff",
                                                        border: "1px solid #E6E9EF",
                                                        padding: "16px",
                                                        borderRadius:"4px"
                                                    }}
                                                >
                                                    <Text size="small" color="secondary">
                                                        Subject
                                                    </Text>
                                                    <Text weight="bold" marginBottom={12}>
                                                        Your order {`{{ order.name }}`} has been updated
                                                    </Text>

                                                    <Divider />

                                                    <Text weight="bold" >
                                                        Order Updated
                                                    </Text>

                                                    <Text size="small">
                                                        Hi {`{{ customer.first_name }}`},
                                                    </Text>

                                                    <Text size="small">
                                                        You have successfully edited your order. Here are the updated
                                                        details:
                                                    </Text>

                                                    <Text size="small" >
                                                        <b>Order:</b> {`{{ order.name }}`}
                                                    </Text>

                                                    <Text size="small">
                                                        We are preparing your items for shipment.
                                                    </Text>

                                                    <Text
                                                        size="small"
                                                        marginTop={12}
                                                        style={{ color: "#1F76C2", cursor: "pointer" }}
                                                    >
                                                        View Order Status
                                                    </Text>

                                                    <Text size="small" >
                                                        Thanks,
                                                    </Text>
                                                    <Text size="small">{`{{ shop.name }}`}</Text>
                                                </Box> */}



                                                <Box border
                                                    style={{
                                                        width: "280px",
                                                        height: "auto",
                                                        background: "#ffffff",
                                                        border: "1px solid #E6E9EF",
                                                        padding: "16px",
                                                        borderRadius: "4px"
                                                    }}
                                                >
                                                    <Text size="small" color="secondary">
                                                        Subject
                                                    </Text>
                                                    <Text weight="bold" marginBottom={12}>
                                                        Your order {`{{ order.name }}`} has been updated
                                                    </Text>

                                                    <Divider />

                                                    <Text weight="bold" >
                                                        Order Updated
                                                    </Text>

                                                    <Text size="small">
                                                        Hi {`{{ customer.first_name }}`},
                                                    </Text>

                                                    <Text size="small">
                                                        You have successfully edited your order. Here are the updated
                                                        details:
                                                    </Text>

                                                    <Text size="small" >
                                                        <b>Order:</b> {`{{ order.name }}`}
                                                    </Text>

                                                    <Text size="small">
                                                        We are preparing your items for shipment.
                                                    </Text>

                                                    <Text
                                                        size="small"
                                                        marginTop={12}
                                                        style={{ color: "#1F76C2", cursor: "pointer" }}
                                                    >
                                                        View Order Status
                                                    </Text>

                                                    <Text size="small" >
                                                        Thanks,
                                                    </Text>
                                                    <Text size="small">{`{{ shop.name }}`}</Text>
                                                </Box>
                                            </Flex>
                                        </Box>

                                    </Box>
                                </Box>
                            </TabPanel>
                            <TabPanel id="overview-panel-third">
                                <Box

                                    // padding="medium"
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        padding: "20px 40px 20px 40px",
                                        backgroundColor: "#ffffff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >

                                    <Box border
                                        style={{
                                            maxWidth: '750px',
                                            width: "100%",

                                            height: "auto",
                                            background: "#E7E9EF",
                                            // padding:"10px 8px",
                                            boxShadow: "none",
                                            borderRadius: "4px"
                                        }}
                                    >
                                        <Box border style={{ padding: "6px" }} >
                                            <Flex justify="space-between" align="center" >
                                                <Text weight="bold">Preview</Text>

                                                <Flex gap={8} align="center">
                                                    <Box className="desktopmobile">


                                                        <Flex
                                                            gap={1}
                                                            style={{
                                                                background: "#f1f1f1",
                                                                padding: "4px",
                                                                borderRadius: "8px",
                                                                width: "fit-content",
                                                            }}
                                                        >
                                                            <Button
                                                                size="small"
                                                            // kind={previewDevice === "desktop" ? "primary" : "tertiary"}
                                                            // onClick={() => setPreviewDevice("desktop")}
                                                            >
                                                                <Flex
                                                                    // align="center" 
                                                                    gap={1}>
                                                                    <Icon icon="desktop" />
                                                                    Desktop
                                                                </Flex>
                                                            </Button>

                                                            <Button
                                                                size="small"
                                                            // kind={previewDevice === "mobile" ? "primary" : "tertiary"}
                                                            // onClick={() => setPreviewDevice("mobile")}
                                                            >
                                                                <Flex
                                                                    //  align="center"
                                                                    gap={1}>
                                                                    <Icon icon="mobile" />
                                                                    Mobile
                                                                </Flex>
                                                            </Button>
                                                        </Flex>

                                                    </Box>
                                                    <Button size="small">Edit Template</Button>
                                                </Flex>
                                            </Flex>
                                        </Box>
                                        <Box style={{ padding: "40px" }}>

                                            <Flex justify="center">
                                                {/* <Box border
                                                    style={{
                                                        width: "500px",
                                                        height:"auto",
                                                        background: "#ffffff",
                                                        border: "1px solid #E6E9EF",
                                                        padding: "16px",
                                                        borderRadius:"4px"
                                                    }}
                                                >
                                                    <Text size="small" color="secondary">
                                                        Subject
                                                    </Text>
                                                    <Text weight="bold" marginBottom={12}>
                                                        Your order {`{{ order.name }}`} has been updated
                                                    </Text>

                                                    <Divider />

                                                    <Text weight="bold" >
                                                        Order Updated
                                                    </Text>

                                                    <Text size="small">
                                                        Hi {`{{ customer.first_name }}`},
                                                    </Text>

                                                    <Text size="small">
                                                        You have successfully edited your order. Here are the updated
                                                        details:
                                                    </Text>

                                                    <Text size="small" >
                                                        <b>Order:</b> {`{{ order.name }}`}
                                                    </Text>

                                                    <Text size="small">
                                                        We are preparing your items for shipment.
                                                    </Text>

                                                    <Text
                                                        size="small"
                                                        marginTop={12}
                                                        style={{ color: "#1F76C2", cursor: "pointer" }}
                                                    >
                                                        View Order Status
                                                    </Text>

                                                    <Text size="small" >
                                                        Thanks,
                                                    </Text>
                                                    <Text size="small">{`{{ shop.name }}`}</Text>
                                                </Box> */}



                                                <Box border
                                                    style={{
                                                        width: "280px",
                                                        height: "auto",
                                                        background: "#ffffff",
                                                        border: "1px solid #E6E9EF",
                                                        padding: "16px",
                                                        borderRadius: "4px"
                                                    }}
                                                >
                                                    <Text size="small" color="secondary">
                                                        Subject
                                                    </Text>
                                                    <Text weight="bold" marginBottom={12}>
                                                        Your order {`{{ order.name }}`} has been updated
                                                    </Text>

                                                    <Divider />

                                                    <Text weight="bold" >
                                                        Order Updated
                                                    </Text>

                                                    <Text size="small">
                                                        Hi {`{{ customer.first_name }}`},
                                                    </Text>

                                                    <Text size="small">
                                                        You have successfully edited your order. Here are the updated
                                                        details:
                                                    </Text>

                                                    <Text size="small" >
                                                        <b>Order:</b> {`{{ order.name }}`}
                                                    </Text>

                                                    <Text size="small">
                                                        We are preparing your items for shipment.
                                                    </Text>

                                                    <Text
                                                        size="small"
                                                        marginTop={12}
                                                        style={{ color: "#1F76C2", cursor: "pointer" }}
                                                    >
                                                        View Order Status
                                                    </Text>

                                                    <Text size="small" >
                                                        Thanks,
                                                    </Text>
                                                    <Text size="small">{`{{ shop.name }}`}</Text>
                                                </Box>
                                            </Flex>
                                        </Box>

                                    </Box>
                                </Box>
                            </TabPanel>
                            <TabPanel id="overview-panel-fourth">
                                <Box

                                    // padding="medium"
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        padding: "20px 40px 20px 40px",
                                        backgroundColor: "#ffffff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >

                                    <Box border
                                        style={{
                                            maxWidth: '750px',
                                            width: "100%",

                                            height: "auto",
                                            background: "#E7E9EF",
                                            // padding:"10px 8px",
                                            boxShadow: "none",
                                            borderRadius: "4px"
                                        }}
                                    >
                                        <Box border style={{ padding: "6px" }} >
                                            <Flex justify="space-between" align="center" >
                                                <Text weight="bold">Preview</Text>

                                                <Flex gap={8} align="center">
                                                    <Button>Hello</Button>
                                                    <Button size="small">Edit Template</Button>
                                                </Flex>
                                            </Flex>
                                        </Box>
                                        <Box style={{ padding: "40px" }}>

                                            <Flex justify="center">
                                                {/* <Box border
                                                    style={{
                                                        width: "500px",
                                                        height:"auto",
                                                        background: "#ffffff",
                                                        border: "1px solid #E6E9EF",
                                                        padding: "16px",
                                                        borderRadius:"4px"
                                                    }}
                                                >
                                                    <Text size="small" color="secondary">
                                                        Subject
                                                    </Text>
                                                    <Text weight="bold" marginBottom={12}>
                                                        Your order {`{{ order.name }}`} has been updated
                                                    </Text>

                                                    <Divider />

                                                    <Text weight="bold" >
                                                        Order Updated
                                                    </Text>

                                                    <Text size="small">
                                                        Hi {`{{ customer.first_name }}`},
                                                    </Text>

                                                    <Text size="small">
                                                        You have successfully edited your order. Here are the updated
                                                        details:
                                                    </Text>

                                                    <Text size="small" >
                                                        <b>Order:</b> {`{{ order.name }}`}
                                                    </Text>

                                                    <Text size="small">
                                                        We are preparing your items for shipment.
                                                    </Text>

                                                    <Text
                                                        size="small"
                                                        marginTop={12}
                                                        style={{ color: "#1F76C2", cursor: "pointer" }}
                                                    >
                                                        View Order Status
                                                    </Text>

                                                    <Text size="small" >
                                                        Thanks,
                                                    </Text>
                                                    <Text size="small">{`{{ shop.name }}`}</Text>
                                                </Box> */}



                                                <Box border
                                                    style={{
                                                        width: "280px",
                                                        height: "auto",
                                                        background: "#ffffff",
                                                        border: "1px solid #E6E9EF",
                                                        padding: "16px",
                                                        borderRadius: "4px"
                                                    }}
                                                >
                                                    <Text size="small" color="secondary">
                                                        Subject
                                                    </Text>
                                                    <Text weight="bold" marginBottom={12}>
                                                        Your order {`{{ order.name }}`} has been updated
                                                    </Text>

                                                    <Divider />

                                                    <Text weight="bold" >
                                                        Order Updated
                                                    </Text>

                                                    <Text size="small">
                                                        Hi {`{{ customer.first_name }}`},
                                                    </Text>

                                                    <Text size="small">
                                                        You have successfully edited your order. Here are the updated
                                                        details:
                                                    </Text>

                                                    <Text size="small" >
                                                        <b>Order:</b> {`{{ order.name }}`}
                                                    </Text>

                                                    <Text size="small">
                                                        We are preparing your items for shipment.
                                                    </Text>

                                                    <Text
                                                        size="small"
                                                        marginTop={12}
                                                        style={{ color: "#1F76C2", cursor: "pointer" }}
                                                    >
                                                        View Order Status
                                                    </Text>

                                                    <Text size="small" >
                                                        Thanks,
                                                    </Text>
                                                    <Text size="small">{`{{ shop.name }}`}</Text>
                                                </Box>
                                            </Flex>
                                        </Box>

                                    </Box>
                                </Box>
                            </TabPanel>
                            <TabPanel id="overview-panel-fifth">
                                <Box

                                    // padding="medium"
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        padding: "20px 40px 20px 40px",
                                        backgroundColor: "#ffffff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >

                                    <Box border
                                        style={{
                                            maxWidth: '750px',
                                            width: "100%",

                                            height: "auto",
                                            background: "#E7E9EF",
                                            // padding:"10px 8px",
                                            boxShadow: "none",
                                            borderRadius: "4px"
                                        }}
                                    >
                                        <Box border style={{ padding: "6px" }} >
                                            <Flex justify="space-between" align="center" >
                                                <Text weight="bold">Preview</Text>

                                                <Flex gap={8} align="center">
                                                    <Box className="desktopmobile">


                                                        <Flex
                                                            gap={1}
                                                            style={{
                                                                background: "#f1f1f1",
                                                                padding: "4px",
                                                                borderRadius: "8px",
                                                                width: "fit-content",
                                                            }}
                                                        >
                                                            <Button
                                                                size="small"
                                                            // kind={previewDevice === "desktop" ? "primary" : "tertiary"}
                                                            // onClick={() => setPreviewDevice("desktop")}
                                                            >
                                                                <Flex
                                                                    // align="center" 
                                                                    gap={1}>
                                                                    <Icon icon="Desktop" />
                                                                    Desktop
                                                                </Flex>
                                                            </Button>

                                                            <Button
                                                                size="small"
                                                            // kind={previewDevice === "mobile" ? "primary" : "tertiary"}
                                                            // onClick={() => setPreviewDevice("mobile")}
                                                            >
                                                                <Flex
                                                                    //  align="center"
                                                                    gap={1}>
                                                                    <Icon icon="Mobile" />
                                                                    Mobile
                                                                </Flex>
                                                            </Button>
                                                        </Flex>

                                                    </Box>
                                                    <Button size="small">Edit Template</Button>
                                                </Flex>
                                            </Flex>
                                        </Box>
                                        <Box style={{ padding: "40px" }}>

                                            <Flex justify="center">
                                                {/* <Box border
                                                    style={{
                                                        width: "500px",
                                                        height:"auto",
                                                        background: "#ffffff",
                                                        border: "1px solid #E6E9EF",
                                                        padding: "16px",
                                                        borderRadius:"4px"
                                                    }}
                                                >
                                                    <Text size="small" color="secondary">
                                                        Subject
                                                    </Text>
                                                    <Text weight="bold" marginBottom={12}>
                                                        Your order {`{{ order.name }}`} has been updated
                                                    </Text>

                                                    <Divider />

                                                    <Text weight="bold" >
                                                        Order Updated
                                                    </Text>

                                                    <Text size="small">
                                                        Hi {`{{ customer.first_name }}`},
                                                    </Text>

                                                    <Text size="small">
                                                        You have successfully edited your order. Here are the updated
                                                        details:
                                                    </Text>

                                                    <Text size="small" >
                                                        <b>Order:</b> {`{{ order.name }}`}
                                                    </Text>

                                                    <Text size="small">
                                                        We are preparing your items for shipment.
                                                    </Text>

                                                    <Text
                                                        size="small"
                                                        marginTop={12}
                                                        style={{ color: "#1F76C2", cursor: "pointer" }}
                                                    >
                                                        View Order Status
                                                    </Text>

                                                    <Text size="small" >
                                                        Thanks,
                                                    </Text>
                                                    <Text size="small">{`{{ shop.name }}`}</Text>
                                                </Box> */}



                                                <Box border
                                                    style={{
                                                        width: "280px",
                                                        height: "auto",
                                                        background: "#ffffff",
                                                        border: "1px solid #E6E9EF",
                                                        padding: "16px",
                                                        borderRadius: "4px"
                                                    }}
                                                >
                                                    <Text size="small" color="secondary">
                                                        Subject
                                                    </Text>
                                                    <Text weight="bold" marginBottom={12}>
                                                        Your order {`{{ order.name }}`} has been updated
                                                    </Text>

                                                    <Divider />

                                                    <Text weight="bold" >
                                                        Order Updated
                                                    </Text>

                                                    <Text size="small">
                                                        Hi {`{{ customer.first_name }}`},
                                                    </Text>

                                                    <Text size="small">
                                                        You have successfully edited your order. Here are the updated
                                                        details:
                                                    </Text>

                                                    <Text size="small" >
                                                        <b>Order:</b> {`{{ order.name }}`}
                                                    </Text>

                                                    <Text size="small">
                                                        We are preparing your items for shipment.
                                                    </Text>

                                                    <Text
                                                        size="small"
                                                        marginTop={12}
                                                        style={{ color: "#1F76C2", cursor: "pointer" }}
                                                    >
                                                        View Order Status
                                                    </Text>

                                                    <Text size="small" >
                                                        Thanks,
                                                    </Text>
                                                    <Text size="small">{`{{ shop.name }}`}</Text>
                                                </Box>
                                            </Flex>
                                        </Box>

                                    </Box>
                                </Box>
                            </TabPanel>
                        </TabPanels>
                    </TabsContext>


                    {/* FOOTER */}

                </Box>
            </Box>
            </Box>
           

        </Box>
    );
}
