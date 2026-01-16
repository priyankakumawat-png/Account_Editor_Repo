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
    Toast,
    Loader,
} from "@vibe/core";
import { Guest, Mobile, MoveArrowLeft } from "@vibe/icons";
import './CreateNewEmail.css'
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";


export default function UpdateEmail() {


    const { id } = useParams();
    const { state } = useLocation();
    const emailData = state?.emailData;
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState();
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
        message: "",
        actions:null
    });
    const [emailSend, setEmailSend] = useState('')

    console.log("cong", internalName, timeFrame, shopifyPlan, SubjectLine, triggerEvent, isEnabled, isCustomize);



    const token =
        "bW9oaXQtc2luZ2gtZGV2Lm15c2hvcGlmeS5jb20xfGpCT2NVUjN2MG9WR1ppWVBqMEpBNWlra3BISjM2amxXWkZVN2VXU3o=";

    const updateEmail = async () => {
        setLoading(true)


        try {
            const res = await axios.post(
                "https://account-editor-stage.fly.dev/api/admin/template/update",
                {
                    timeFrame: {
                        time: timeFrame.time,
                        type: timeFrame.type,
                    },
                    id: id,

                    plans: {
                        basic: shopifyPlan.Basic,
                        shopify: shopifyPlan.Grow,
                        advance: shopifyPlan.Advance,
                        plus: shopifyPlan.Plus,
                    },
                    onesPerStore: true,
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
                message: res.data.message
                
            })
            console.log("EMAIL Updated 👉", res);
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
        setIsEnabled(false)

    }

    // console.log("EMAIL DATA:", emailData);
    useEffect(() => {


        setHtmlContent(emailData.emailTemplate)
        setIsCustomize(emailData.isCustomize)
        setIsEnabled(emailData.isActive);
        setInternalName(emailData.templateName)
        setSubjectLine(emailData.subject)
        setTimeFrame(emailData.timeFrame)
        setTriggerEvent(emailData.type)
        setShopifyPlan({
            Basic: emailData.plans.basic,
            Grow: emailData.plans.shopify,
            Advance: emailData.plans.advance,
            Plus: emailData.plans.plus,
        });

    }, [emailData, id])


    // console.log("trige", triggerEvent);




  





    const dropdownOptions = [
        { label: "App Installed", value: "installation" },
        { label: "App Uninstalled", value: "uninstalled" },
        { label: "Expired", value: "expired" },
        { label: "Ordet Edit", value: "order_edit" },
        { label: "Add Widget", value: "add_widget" },
        { label: "Gold", value: "gold" },
        { label: "Silver", value: "silver" },
        { label: "Bronze", value: "bronze" },
    ];




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
                dynamicData:dynamicData

            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        shop: "mohit-singh-dev.myshopify.com",
                        "Content-Type": "application/json",
                    },
                }
            )
         setToast({
                open: true,
                type: "positive",
                message: "Email Send Sucesfully"

            })
            console.log('EmailSended', res);

        } catch (error) {
            console.log("error in sendingemail", error);
             setToast({
                open: true,
                type: "warning",

                message: error.message

            })
        }
        finally {
            setLoading(false)
        }
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

    return (
        <Box className="createmainemailconti">

            <Box className="maininner">
                {/* TOP BAR */}
                <Box>
                    <Flex
                        //  align="center"
                        justify="space-between" >
                        <Flex
                            onClick={() => navigate('/emailcenter')}
                            gap="small">
                            <Icon icon={MoveArrowLeft} />
                            <Text type="text1" weight="medium">Update Email</Text>
                        </Flex>

                        <Flex
                            // align="center"
                            gap="small">
                            <Text>Status:</Text>
                            <Checkbox
                                label={<span style={{ color: "#00854D", fontWeight: "bold" }}>Enabled</span>}
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
                                height: "100%",
                                width: "30%",
                                // flex:1,
                                // height: "autp",
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
                                                ariaLabel="Trigger Event"
                                                placeholder="Select Trigger Event"
                                                options={dropdownOptions}
                                                value={dropdownOptions?.find(opt => opt.value === triggerEvent) || null}
                                                // inputValue={triggerEvent}
                                                onOptionSelect={(option) => setTriggerEvent(option.value)}
                                                menuPosition="fixed"
                                                onClear={() => setTriggerEvent('')}
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
                                                        flex: 1
                                                    }}
                                                >

                                                    <Dropdown
                                                        ariaLabel="Overview dropdown"
                                                        id="overview-dropdown"
                                                        placeholder="Select Period"
                                                        selectedOption={
                                                            timeFrame.type
                                                                ? { label: timeFrame.type, value: timeFrame.type }
                                                                : null
                                                        }
                                                        onOptionSelect={(option) =>
                                                            setTimeFrame((prev) => ({
                                                                ...prev,
                                                                type: option.value,
                                                            }))
                                                        }
                                                        value={periodOptions?.find(opt => opt.value === timeFrame.type) || null}

                                                        options={periodOptions}
                                                    />

                                                </div>
                                            </Flex>

                                        </Box>
                                    )}



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
                                // height: "100vh",
                                // background: "#ECEFF8",
                                borderRadius: "8px",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {/* TABS */}
                            <TabsContext id="overview-tabs" className="tabsforemail">
                                <Flex justify="space-between">

                                    <TabList
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
                                                align="end"
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
                                                    kind={previewDevice === "desktop" ? "primary" : "tertiary"}
                                                    onClick={() => setPreviewDevice("desktop")}
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
                                                    kind={previewDevice === "mobile" ? "primary" : "tertiary"}
                                                    onClick={() => setPreviewDevice("mobile")}
                                                >
                                                    <Flex
                                                        //  align="center" 
                                                        gap={1}>
                                                        <Icon icon="mobile" />
                                                        Mobile
                                                    </Flex>
                                                </Button>
                                            </Flex>
                                        )}
                                    </Box>
                                </Flex>


                                <TabPanels id="overview-tab-panels" className="tabsforemail">
                                    {activeTab === 0 ? (
                                        <TabPanel id="overview-panel-first" className="tabsforemail">

                                            {/* EDITOR */}
                                            <Box
                                                style={{
                                                    height: "95%",
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
                                                {/* EDITOR AREA */}
                                                {/* <Box
                                                style={{
                                                    // height:"90%",
                                                    // flex: 1,
                                                    // overflow: "hidden",
                                                }}
                                            > */}
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
                                                {/* </Box> */}

                                                {/* FOOTER BAR */}
                                                <Flex
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


                                        </TabPanel>
                                    ) : activeTab === 1 ? (
                                        <TabPanel id="overview-panel-second">
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

                                        </TabPanel>
                                    ) :

                                        <TabPanel id="overview-panel-third">
                                                
                                            <Box
                                                style={{
                                                    width: "100%",
                                                    maxWidth: "700px",
                                                    padding: "20px",
                                                    backgroundColor: "#FFFFFF"
                                                }}
                                            >
                                                    <Flex direction="column" gap={10} align="start">
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
                                                    style={{ color: "#6b6f8c"}}
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
                                                        width:"100%",
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
                                            </Flex>
                                            </Box>

                                        </TabPanel>
                                    }



                                </TabPanels>
                            </TabsContext>



                            {/* FOOTER */}

                        </Box>
                    </Flex>
                </Box>
                <Box className="footer-btnof">

                    {/* <Flex gap="small" align="end"> */}
                    <Button size="small" kind="secondary" onClick={() => navigate('/emailcenter')}>Cancel</Button>
                    <Button size="small" onClick={updateEmail}> {loading ? <Loader size="small" /> : "Update Changes"}</Button>
                    {/* </Flex> */}
                </Box>
            </Box>
            {/* {toast && ( */}
            <Toast
                open={toast.open}
                type={toast.type}
                onClose={() => setToast({ ...toast, open: false })}
                autoHideDuration={toast.type === "loading" ? null : 2000}
                actions={toast.actions}
            >
                {toast.message}
            </Toast>
            {/* )} */}


        </Box>
    );
}
