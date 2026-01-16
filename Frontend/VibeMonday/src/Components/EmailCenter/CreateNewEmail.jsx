import {
    Box,
    Flex,
    Text,
    Button,
    TextField,
    Dropdown,
    Checkbox,
    Tab,
    Heading,
    Divider,
    Label,
    Icon,
    TabList,
    TabPanel,
    TabPanels,
    TabsContext,
    TextArea,
    ModalContent,
    ModalFooter,
    Modal,
    ModalHeader,
    Loader,
    Toast,
} from "@vibe/core";
import { Description, Guest, Home, Mobile, MoveArrowLeft } from "@vibe/icons";
import './CreateNewEmail.css'
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function CreateNewEmail() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState(0);
    console.log("jh" , activeTab);
    
    const [previewDevice, setPreviewDevice] = useState("desktop");
    const [htmlContent, setHtmlContent] = useState('');
    const [insertModal, setInsertModal] = useState(false)
    const [internalName, setInternalName] = useState('')
    const [SubjectLine, setSubjectLine] = useState('')
    const [triggerEvent, setTriggerEvent] = useState()
    const [timeFrame, setTimeFrame] = useState({
        time: "",
        type: ""
    })
    const [shopifyPlan, setShopifyPlan] = useState({
        Basic: false,
        Grow: false,
        Advance: false,
        Plus: false,
    });
    const [isEnabled, setIsEnabled] = useState(false)
    const [isCustomize, setIsCustomize] = useState(false)
    const [oncePerStore, setOncePerStore] = useState(false)
    const [toast, setToast] = useState({
        open: false,
        type: "positive",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [emailSend, setEmailSend] = useState('')


    console.log("once",
        triggerEvent,
        isCustomize, emailSend);

    const toggleArrayValue = (setFn, value) => {
        setFn((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const token =
        "bW9oaXQtc2luZ2gtZGV2Lm15c2hvcGlmeS5jb20xfGpCT2NVUjN2MG9WR1ppWVBqMEpBNWlra3BISjM2amxXWkZVN2VXU3o=";

    const createEmail = async () => {
        setLoading(true)
        try {
            const res = await axios.post(
                "https://account-editor-stage.fly.dev/api/admin/template/create",
                {
                    timeFrame: {
                        time: timeFrame.time,
                        type: timeFrame.type,
                    },
                    plans: {
                        basic: shopifyPlan.Basic,
                        shopify: shopifyPlan.Grow,
                        advance: shopifyPlan.Advance,
                        plus: shopifyPlan.Plus,
                    },
                    onesPerStore: oncePerStore,
                    type: triggerEvent,
                    subject: SubjectLine,
                    receiverType: "marketing",
                    lang: "en",
                    templateName: internalName,
                    status: false,
                    isActive: isEnabled,
                    isCustomize: isCustomize,
                    emailTemplate: htmlContent,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        shop: "mohit-singh-dev.myshopify.com",
                        "Content-Type": "application/json",
                    },
                }
            );

            setToast({
                open: true,
                type: "positive",

                message: "EmailCreate"

            })
            console.log("EMAIL CREATED 👉", res);
        } catch (error) {
            console.error("CREATE EMAIL ERROR 👉", error.response?.data || error.message);
        }
        finally {
            setLoading(false)
        }
    };


    const removeAll = () => {
        setHtmlContent('')
        setInternalName('')
        setSubjectLine('')
        setTimeFrame({
            time: "",
            type: ""
        })
        setTriggerEvent()
        setShopifyPlan({
            Basic: false,
            Grow: false,
            Advance: false,
            Plus: false,
        })
        setIsCustomize(false)
        setOncePerStore(false)
        setIsEnabled(false)

    }




    const periodOptions = [
        ...(["installation", "add_widget", "order_edit"].includes(triggerEvent)
            ? [{ label: "Minutes", value: "minutes" }]
            : []),
        { label: "Days", value: "days" },
    ];




    useEffect(() => {
        if (triggerEvent === "add_widget") {
            setIsCustomize(true);
        }
        else if (triggerEvent === "expired") {
            setIsCustomize(true);
        }
        else if (triggerEvent === "order_edit") {
            setIsCustomize(true);
        }
        else {
            setIsCustomize(false)
        }
    }, [triggerEvent]);


    const dynamicData = {
        name: "Priyanka",
        shop_name: "IT Geeks Store",
        shop_domain: "itgeeks.myshopify.com",
        plan_name: "Pro",
        dashboard_url: "https://app.accounteditor.com",
        installed_at: "15 Jan 2026",
        unsubscribe_url: "#"
    };


    const sendEmail = async () => {
        setLoading(true)
        try {
            const res = await axios.post(`https://account-editor-stage.fly.dev/api/admin/email/send`, {
                emailHtml: htmlContent,
                receiverEmail: emailSend,
                subject: SubjectLine,
                dynamicData: dynamicData

            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        shop: "mohit-singh-dev.myshopify.com",
                        "Content-Type": "application/json",
                    },
                }
            )

            console.log('EmailSended', res);
            setToast({
                open: true,
                type: "positive",

                message: "EmailSend Sucesfully"

            })
        } catch (error) {
            console.log("error in sendingemail", error);

        }
        finally {
            setLoading(false)
        }
    }





    return (
        <Box className="createmainemailconti">

            <Box className="maininner">
                {/* TOP BAR */}
                <Box>
                    <Flex justify="space-between">
                        <Flex align="center" gap="small" onClick={() => navigate('/emailcenter')}>
                            <Icon icon={MoveArrowLeft} />
                            <Heading type="h4">Create New Email</Heading>
                        </Flex>

                        <Flex align="center" gap="small">
                            <Text>Status:</Text>
                            <Checkbox
                                label={<span style={{ color: "#00854D", fontWeight: "bold" }}>{isEnabled && (
                                    "Enabled"
                                )}</span>}
                                checked={isEnabled}
                                onChange={() => setIsEnabled((prev) => !prev)}
                            />

                        </Flex>
                    </Flex>
                </Box>

                {/* MAIN CONTENT */}
                <Box>
                    <Flex gap={12} align="stretch"
                        style={{ height: "100%" }}
                    >

                        {/* LEFT SETTINGS PANEL */}
                        <Box border borderColor="#C3C6D4"
                            style={{
                                width: "30%",
                                // flex:1,
                                height: "100%",
                                background: "#fff",
                                borderRadius: "8px",
                                // padding: "16px",
                                // border: "1px solid black"
                            }}
                        >
                            <Box border borderColor="#C3C6D4">
                                <Text type="text1" weight="medium" style={{ padding: "12px", backgroundColor: "#ECEFF8" }}>
                                    Settings
                                </Text>
                                {/* <Divider /> */}
                            </Box>

                            <Box padding="medium">

                                <Flex direction="column" gap={20} align="start">

                                    <Box style={{ width: "100%" }}>
                                        <Text type="text1" weight="medium">Internal Name</Text>
                                        <TextField className="inter-textfiled"
                                            onChange={(value) => setInternalName(value)}
                                            value={internalName}
                                            size="medium"
                                            placeholder="Welcome Email"
                                        />
                                    </Box>

                                    <Box style={{ width: "100%" }}>
                                        <Box>
                                            <Flex justify="space-between">
                                                <Text type="text1" weight="medium">Subject Line</Text>
                                                <Text type="text3" color="#1F76C2" style={{ color: "#1F76C2", cursor: "pointer", textDecoration: "#00854D" }}
                                                    weight="normal" onClick={() => setInsertModal(true)}
                                                >{"{{Inser Variable}}"}</Text>
                                            </Flex>
                                        </Box>
                                        <TextField className="inter-textfiled"
                                            onChange={(value) => setSubjectLine(value)}
                                            value={SubjectLine}
                                            size="medium"
                                            placeholder="Welcome to {{shop_name}}"
                                        />
                                    </Box>

                                    {insertModal && (
                                        <Modal

                                            id="modal-basic"
                                            onClose={() => setInsertModal(false)}
                                            show={insertModal}
                                            size="medium"
                                            width="350px"
                                        >
                                            <ModalHeader
                                                title="Insert Variable"
                                            />
                                            <ModalContent style={{ width: "100%" }}>
                                                <Box >
                                                    <Flex gap={10}>
                                                        <Box style={{ width: "100%" }}>
                                                            <Flex justify="space-between" >
                                                                <Text>{"{{shop_name}}"}</Text>
                                                                <Text>Shop Name</Text>
                                                            </Flex>
                                                            <Divider />
                                                            <Flex justify="space-between" >
                                                                <Text>{"{{shop_domain}}"}</Text>
                                                                <Text>Shop Domain</Text>
                                                            </Flex>
                                                            <Divider />
                                                            <Flex justify="space-between" >
                                                                <Text>{"{{shop_owner}}"}</Text>
                                                                <Text>Shop owner</Text>
                                                            </Flex>
                                                            <Divider />
                                                            <Flex justify="space-between" >
                                                                <Text>{"{{plan_name}}"}</Text>
                                                                <Text>Plan Name</Text>
                                                            </Flex>
                                                            <Divider />
                                                            <Flex justify="space-between" >
                                                                <Text>{"{{dashboard_url}}"}</Text>
                                                                <Text>Link to App</Text>
                                                            </Flex>
                                                            <Divider />
                                                            <Flex justify="space-between" >
                                                                <Text>{"{{installed_at}}"}</Text>
                                                                <Text>Date Installed</Text>
                                                            </Flex>
                                                            <Divider />
                                                        </Box>
                                                    </Flex>
                                                </Box>
                                            </ModalContent>
                                            <ModalFooter
                                                primaryButton={{
                                                    onClick: function Xs() { },
                                                    text: 'Confirm'
                                                }}
                                                secondaryButton={{
                                                    onClick: function Xs() { },
                                                    text: 'Cancel'
                                                }}
                                            />
                                        </Modal>
                                    )}

                                    <Box style={{ width: "100%" }}>
                                        <Text type="text1" weight="medium">Trigger Event</Text>

                                        <div
                                            style={{
                                                height: 'auto',

                                            }}
                                        >
                                            <Dropdown
                                                className="inter-textfiled"
                                                ariaLabel="Overview dropdown"
                                                id="overview-dropdown"
                                                placeholder="Trigger Event here"

                                                onOptionSelect={(option) =>
                                                    setTriggerEvent(option.value)   // ✅ STRING ONLY
                                                }
                                                options={[
                                                    { label: "App Installed", value: "installation" },
                                                    { label: "App Uninstalled", value: "uninstalled" },
                                                    { label: "Expired", value: "expired" },
                                                    { label: "Ordet Edit", value: "order_edit" },
                                                    { label: "Add Widget", value: "add_widget" },
                                                    { label: "Gold", value: "gold" },
                                                    { label: "Silver", value: "silver" },
                                                    { label: "Bronze", value: "bronze" },

                                                ]}
                                                menuPosition="fixed"
                                            />
                                        </div>

                                    </Box>
                                    {!["gold", "bronze", "silver"].includes(triggerEvent) && (

                                        <Checkbox
                                            label="Schedule"

                                            checked={isCustomize}
                                            disabled={["add_widget", "expired", "order_edit"].includes(triggerEvent)}

                                            onChange={() => setIsCustomize((prev) => !prev)}

                                        />
                                    )}

                                    {["installation"].includes(triggerEvent) && (

                                        <Checkbox
                                            label="Send only once per store"
                                            checked={oncePerStore}
                                            onChange={() => setOncePerStore((prev) => !prev)}

                                        />
                                    )}


                                    {isCustomize === true && !["gold", "bronze", "silver"].includes(triggerEvent) && (

                                        <Box style={{ width: "100%", height: "100%", overflow: "visible" }} >
                                            <Text type="text1" weight="medium">Send After</Text>
                                            <Flex gap="small" style={{ width: "100%" }}>
                                                <div
                                                    style={{ maxWidth: "100px" }}
                                                >

                                                    <TextField
                                                        placeholder="Enter Period"
                                                        value={timeFrame.time}
                                                        size="medium"
                                                        onChange={(value) =>
                                                            setTimeFrame((prev) => ({
                                                                ...prev,
                                                                time: value
                                                            }))
                                                        }
                                                    />
                                                </div>


                                                <div
                                                    style={{
                                                        height: "auto",
                                                        flex: 1,
                                                    }}
                                                >

                                                    <Dropdown


                                                        ariaLabel="Overview dropdown"
                                                        id="overview-dropdown"
                                                        placeholder="Select Period"

                                                        // value={
                                                        //     periodOptions.find(
                                                        //         (opt) => opt.value === timeFrame.type
                                                        //     ) || null
                                                        // }

                                                        onOptionSelect={(option) =>
                                                            setTimeFrame((prev) => ({
                                                                ...prev,
                                                                type: option ? option.value : null,
                                                            }))
                                                        }


                                                        options={periodOptions}
                                                    />



                                                </div>
                                            </Flex>


                                        </Box>
                                    )
                                    }


                                    <Divider />
                                    <Box >
                                        <Flex direction="column" gap={5} align="start">

                                            <Text type="text1" weight="medium" >Shopify Plan Filter</Text>
                                            {["Basic", "Grow", "Advance", "Plus"].map((item) => (
                                                <Checkbox
                                                    key={item}
                                                    label={item}
                                                    checked={shopifyPlan[item]}
                                                    onChange={() =>
                                                        setShopifyPlan((prev) => ({
                                                            ...prev,
                                                            [item]: !prev[item],
                                                        }))
                                                    }
                                                />
                                            ))}

                                        </Flex>

                                    </Box>

                                </Flex>
                            </Box>

                        </Box>

                        {/* RIGHT EDITOR PANEL */}
                        <Box border borderColor="#C3C6D4"
                            style={{
                                flex: 1,
                                // height: "100%",
                                // background: "#ECEFF8",
                                borderRadius: "8px",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {/* TABS */}
                            <TabsContext id="overview-tabs" className="tabsforemail">
                                <Flex justify="space-between" >

                                <TabList
                                size="large"
                                    id="overview-tab-list"
                                    className="tabslist"
                                    activeTabId={activeTab}
                                    onTabChange={(index) => setActiveTab(index)}
                                >
                                    <Tab id="html">HTML</Tab>
                                    <Tab id="preview">Preview</Tab>

                                    <Tab id="test">Test Send</Tab>




                                </TabList>
                                    <Box className="desktopmobile">

                                        {activeTab === 1 && (
                                            <Flex

                                                gap={1}
                                                justify="space-between"
                                                style={{
                                                    background: "#f1f1f1",
                                                    padding: "4px",
                                                    borderRadius: "8px",
                                                    width: "fit-content",
                                                }}
                                            >
                                                 <Button
                                                    size="small"
                                                    kind={previewDevice === "desktop" ? "primary" : "tertiary"}
                                                    onClick={() => setPreviewDevice("desktop")}
                                                    leftIcon={Home}
                                               >
                                                    
                                                        Desktop
                                                   
                                                </Button>

                                                <Button
                                                    size="small"
                                                    kind={previewDevice === "mobile" ? "primary" : "tertiary"}
                                                    onClick={() => setPreviewDevice("mobile")}
                                                    leftIcon={Mobile}
                                                >
                                                  
                                                        Mobile
                                                    
                                                </Button>
                                            </Flex>
                                        )}
                                    </Box>
                                </Flex>

                                {/* <Flex style={{ width: "100%" }} >
                                    <TabList
                                        size="large"
                                        id="overview-tab-list"
                                        className="tabslist"
                                        activeTabId={activeTab}
                                        onTabChange={(tabId) => setActiveTab(tabId)}                                    >
                                        <Tab id="html">HTML</Tab>
                                        <Tab id="preview">Preview</Tab>
                                        <Tab id="test">Test Send</Tab>
                                    </TabList>

                                    {activeTab === 1 && (
                                        <Box style={{ marginLeft: "auto" }}>
                                            <Flex
                                                gap={1}
                                                justify="space-between"
                                                style={{
                                                    background: "#f1f1f1",
                                                    padding: "4px",
                                                    borderRadius: "8px",
                                                    width: "fit-content",
                                                }}
                                            >
                                                <Button
                                                    size="small"
                                                    kind={previewDevice === "desktop" ? "primary" : "tertiary"}
                                                    onClick={() => setPreviewDevice("desktop")}
                                                    leftIcon={Home}
                                                >
                                                    Desktop
                                                </Button>

                                                <Button
                                                    size="small"
                                                    kind={previewDevice === "mobile" ? "primary" : "tertiary"}
                                                    onClick={() => setPreviewDevice("mobile")}
                                                    leftIcon={Mobile}
                                                >
                                                    Mobile
                                                </Button>
                                            </Flex>
                                        </Box>
                                    )}
                                 </Flex> */}



                                <TabPanels id="overview-tab-panels" className="tabsforemail">

                                    {activeTab === 0 ? (
                                    <TabPanel id="html" className="tabsforemail">
                                        
                                        {/* EDITOR */}
                                        <Box
                                            style={{
                                                height: "100%",
                                                flex: 1,
                                                background: "#2E2F33",
                                                color: "#fff",
                                                padding: "16px",
                                                fontFamily: "monospace",
                                                fontSize: "13px",
                                                overflow: "auto",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between"
                                            }}
                                        >
                                            {activeTab === 0 && (
                                                <textarea className="textfirld"

                                                    size="large"
                                                    rows={14}
                                                    style={{ color: "white", whiteSpace: "pre", height: "" }}
                                                    value={htmlContent}
                                                    onChange={(e) => setHtmlContent(e.target.value)}
                                                    placeholder="Write HTML here"
                                                />
                                            )}


                                            <Flex
                                                // align="center"

                                                justify="space-between"
                                                style={{ borderTop: "1px solid #76797eff" }}
                                            >
                                                <Box>
                                                    <Text type="text3" color="#ffffff" >
                                                        Use{"{{Variables}}"}  for personalization.
                                                    </Text>
                                                </Box>

                                                <Box>
                                                    <Text type="text3" color="#ffffff"

                                                        onClick={() => setInsertModal(!insertModal)}
                                                        style={{ cursor: "pointer" }}>{"{{Inset Variable}}"}</Text>
                                                </Box>
                                            </Flex>
                                        </Box>
                                        {/* </Box> */}
                                    </TabPanel>
                                    ) : activeTab === 1 ? (

                                    <TabPanel id="preview">
                                        {activeTab === 1 && (

                                            <Box
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    padding: "60px 30px",
                                                    background: "#F6F7FB",
                                                }}
                                            >
                                                <div
                                                    className={`email-preview ${previewDevice === "mobile"
                                                        ? "email-preview-mobile"
                                                        : "email-preview-desktop"
                                                        }`}
                                                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                                                />

                                            </Box>
                                        )}

                                    </TabPanel>
                                    ) : 
                                    <TabPanel id="test">

                                        <Box
                                            style={{
                                                width: "100%",
                                                maxWidth: "700px",
                                                padding: "20px",
                                                backgroundColor: "#FFFFFF"
                                            }}
                                        >
                                            {/* Title */}
                                            <Text
                                                type="text1"
                                                weight="bold"
                                                style={{ fontSize: "18px" }}
                                            >
                                                Send a test email
                                            </Text>

                                            {/* Subtitle */}
                                            <Text
                                                type="text2"
                                                style={{ color: "#6b6f8c", marginBottom: "16px" }}
                                            >
                                                Send a version of this email to yourself to check rendering.
                                            </Text>

                                            {/* Recipient */}
                                            <Box >
                                                <Text
                                                    type="text3"
                                                    weight="medium"
                                                   
                                                >
                                                    Recipient
                                                </Text>

                                                <Box style={{ maxWidth: "360px" }}>
                                                    <TextField
                                                        placeholder="me@company.com"
                                                        size="small"
                                                        value={emailSend}
                                                        onChange={(value) => setEmailSend(value)}
                                                    />
                                                </Box>
                                            </Box>

                                            {/* Button */}
                                            <Button kind="primary" size="small" onClick={sendEmail} >
                                                {loading ? <Loader size="small" /> : "Send Test"}
                                            </Button>

                                            {/* Divider */}
                                            <Box
                                                style={{
                                                    // marginTop: "24px",
                                                    borderTop: "1px solid #e6e9ef",
                                                    paddingTop: "12px",
                                                }}
                                            >
                                                <Flex gap="small"
                                                //  align="center"
                                                >
                                                    <Text type="text3" style={{ color: "#323338" }}>
                                                        <strong>Last test:</strong> Sent 10 minutes ago to dev@company.com
                                                    </Text>

                                                    {/* Status badge */}
                                                    <Box
                                                        style={{
                                                            background: "#cce5d8",
                                                            color: "#116846",
                                                            padding: "2px 8px",
                                                            borderRadius: "4px",
                                                            fontSize: "12px",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        Delivered
                                                    </Box>
                                                </Flex>
                                            </Box>
                                        </Box>

                                    </TabPanel>
                                }

                                    

                                </TabPanels>
                            </TabsContext>



                            {/* FOOTER */}

                        </Box>
                    </Flex>
                </Box>

                <Box className="footer-btnof"
                >
                    <Button size="small" kind="secondary" onClick={removeAll}>Cancel</Button>
                    <Button size="small" onClick={createEmail}>
                        {loading ? <Loader size="small" /> : "Save Changes"}</Button>
                </Box>


            </Box>
            {toast && (
                <Toast
                    open={toast.open}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, open: false })}
                >
                    {toast.message}
                </Toast>
            )}
        </Box>
    );
}
