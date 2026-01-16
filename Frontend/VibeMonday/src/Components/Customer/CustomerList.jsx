
import { useEffect, useMemo, useState } from "react";
import './CustomerList.css'
import { Activity, Add, Baseline, Check, Close, CloseMedium, CloseSmall, CreditCard, Download, Email, ExternalPage, Filter, Globe, Hide, Menu, Numbers, Show, Sort, Tags, UserDomain } from "@vibe/icons";
import {
  Heading, Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell,
  Checkbox, Label, Button, Search, Flex, Text, Box, Icon, Steps, Divider, useMediaQuery, Modal, ModalHeader, ModalContent,
  ModalFooter, Chips, Dropdown, TextField, Dialog, RadioButton, DialogContentContainer, useSwitch, IconButton, ListItem,
  Toast,
  Skeleton,
} from "@vibe/core";
import Vector from '../../assets/Images/Vector.svg'
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import FilterCustomer from "./FilterCustomer";
import CustomerTogInfo from "./CustomerTogInfo";
import TableSkeleton from "../Common/TableSkeleton";

// import MenuBar from "../Navbar/MenuBar";
/* ---------------- CONFIG ---------------- */

const PAGE_SIZE = 8;

const statusColorMap = {
  active: "#B5CEC0",
  trial: "#FCEBA1",
  uninstall: "#F4C3CB",
};

const columns = [
  { id: "checkbox", title: <Checkbox />, width: "50px", height: "67px" },
  { id: "name", title: "Name", height: "67px" },
  { id: "storename", title: "Store name" },
  { id: "url", title: "URL" },
  { id: "shopifyplan", title: "Shopify plan" },
  { id: "aeplan", title: "AE plan" },
  { id: "status", title: "Status" },
];


export default function CustomerList() {


  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSortDialogue, setIsSortDialogue] = useState(false)
  const [showToast, setShowToast] = useState({
    open: false,
    message: "",
    type: "warning",
    action: []
  })
  const [userInfo, setUserIfo] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState();
  const [aePlan, setAePlan] = useState([])
  const [shopifyPlan, setShopifyPlan] = useState([])
  const [status, setStatus] = useState([])
  const [days, setDays] = useState({
    min: "",
    max: "",
  });
  const [orders, setOrders] = useState({
    min: "",
    max: "",
  });
  const [checkBoxSlected, setCheckBoxSlected] = useState([])
  const [isShowMenuCheck, setisShowMenuCheck] = useState(false)
  const [tag, setTag] = useState('')
  const [addTag, setAddTag] = useState(false)
  const [tags, setTags] = useState([]);
  const [isSortBy, setIsSortBy] = useState('');
  const [editColumns, setEditColumns] = useState(false)
  const [eyeOpen, setEyeOpen] = useState({})

  const token = localStorage.getItem("UserToken")


  if (!token) {
    navigate("/signin");
    return;
  }

  const showErrorToast = (message) => {
    setShowToast({
      open: true,
      message,
      type: "warning",
    });
  };





  useEffect(() => {
    getStore(shopifyPlan, aePlan, status, days, isSortBy)
  }, [])


  const getStore = async (
    shopifyPlan = [],
    aePlan = [],
    status = [],
    days = {},
    isSortBy = ""
  ) => {
    setIsLoading(true)
    try {
      const res = await axios.get(
        "https://kindra-unsonorous-gale.ngrok-free.dev/partnerevents/stores",
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            shopify_plan: Array.isArray(shopifyPlan) && shopifyPlan.length
              ? shopifyPlan.join(",")
              : undefined,

            plan: Array.isArray(aePlan) && aePlan.length
              ? aePlan.join(",")
              : undefined,

            status: Array.isArray(status) && status.length
              ? status.map(s => s.toLowerCase()).join(",")
              : undefined,

            minDays: days?.min || undefined,
            maxDays: days?.max || undefined,
            sortBy: isSortBy || undefined,
          },
        }
      );

      // ✅ Response safety check
      if (!res?.data?.data) {
        setData([]);
        return;
      }

      // console.log(res.data.data);
      setData(res.data.data);

    }
    catch (error) {

      // console.log(error.message)
      let message = "Something went wrong. Please try again.";

      if (!error.message) {
        message = "Something went wrong. Please try again.";
      } else if(error.message){
       message=  `${error.message}`
      }
       else if (error.res.status === 401) {
        message = "Session expired. Please login again.";
      } else if (error.res.status >= 500) {
        message = "Server error. Please try again later.";
      }

      setData([]);
      showErrorToast(message);
    }
    finally {
      setIsLoading(false)
    }
  };




  const filteredData = useMemo(() => {
    if (!search) return data;

    const lowerSearch = search.toLowerCase();

    return data.filter((row) =>
      row.storeName?.toLowerCase().includes(lowerSearch) ||
      row.ownerName?.toLowerCase().includes(lowerSearch) ||
      row.AEplan?.toLowerCase().includes(lowerSearch) ||
      row.shopifyPlan?.toLowerCase().includes(lowerSearch) ||
      row.status?.toLowerCase().includes(lowerSearch)
    );
  }, [data, search,]);

  const totalPages = Math.ceil((filteredData?.length || 0) / PAGE_SIZE);


  const pageData = useMemo(() => {
    const safeData = filteredData || [];

    return safeData.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    );
  }, [filteredData, page]);


  const steps = Array.from({ length: totalPages }, (_, i) => ({
    title: `${i + 1}`
  }));





  const toggleArrayValue = (setFn, value) => {
    setFn((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleDaysChange = (type, value) => {
    setDays((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // console.log("jdjd", eyeOpen);


  const handleClearall = () => {
    setAePlan([])
    setShopifyPlan([])
    setStatus([])
    setDays({ min: '', max: '' })
    setOrders({ min: '', max: '' })
  }






  const addtags = async () => {
    if (!tag.trim()) return;

    const updatedTags = tags.includes(tag)
      ? tags
      : [...tags, tag];

    setTags(updatedTags);

    try {
      const res = await axios.put(
        "https://kindra-unsonorous-gale.ngrok-free.dev/api/partner-store/add_tags",
        {
          domains: checkBoxSlected,
          tags: updatedTags
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("sending data", checkBoxSlected, updatedTags);

      console.log("SUCCESS 👉", res);
      setisShowMenuCheck(false)
      setTag("");
      setTags([])
      setAddTag(false);
      setCheckBoxSlected([])

    } catch (error) {
      console.error(
        "API ERROR 👉",
        error.response?.data || error
      );
    }
  };



 
  const removeTags = async () => {
    if (!tag.trim()) return;

    const updatedTags = tags.includes(tag)
      ? tags
      : [...tags, tag];

    setTags(updatedTags);

    try {
      const res = await axios.put(
        "https://kindra-unsonorous-gale.ngrok-free.dev/api/partner-store/remove_tags",
        {
          domains: checkBoxSlected,
          tags: updatedTags,
          isBlock: true,
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("sending data", checkBoxSlected, updatedTags);

      console.log("SUCCESS 👉", res);
      setisShowMenuCheck(false)
      setTag("");
      setTags([])
      setAddTag(false);
      setCheckBoxSlected([])

    } catch (error) {
      console.error(
        "API ERROR 👉",
        error.response?.data || error
      );
    }
  }

  const exportCsv = async () => {


    try {
      const res = await axios.get(
        "https://kindra-unsonorous-gale.ngrok-free.dev/api/partner-stores/export",

        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );


      console.log("SUCCESS 👉", res.data.csvUrl);

      const csvUrl = res?.data?.csvUrl;

      if (!csvUrl) {
        console.log("CSV URL not found");

      }

      // 🔥 CSV open / download
      window.open(csvUrl, "_blank");


    } catch (error) {
      console.error(
        "API ERROR 👉",
        error.response?.data || error
      );
    }
  }


  return (


    <Box style={{ backgroundColor: "#ffffff", borderRadius: "10px", width: "100%" }} className="mnai-conti">

      <Box  >

        <Box style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

          <Flex gap={10} justify="space-between"
            align="center"
          // style={{ marginBottom: 16 }}
          >
            <Heading type="h3" weight="medium" color="#ECEFF8" >
              All customers
              ({filteredData?.length || 0})
            </Heading>

            <Button size="small" kind="primary" leftIcon={Download}
              onClick={exportCsv}>
              Export
            </Button>
          </Flex>

          <Box >
            <Flex
              align="center"
              justify="space-between"
              wrap
              style={{ marginBottom: 16 }}
            >
              <Box  >
                <Search
                  size="small"
                  placeholder="Search customers"
                  value={search}
                  onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                  }}

                />
              </Box>

              <Flex align="center" gap={12} wrap className="toolbar-actions" >
                {editColumns ? <>
                  <Flex gap={12}>
                    <Button size="small" kind="secondary" onClick={() => setEditColumns(!editColumns)} >Cancel</Button>
                    <Button size="small" kind="primary" >Save</Button>
                  </Flex>
                </> : <>
                  {checkBoxSlected.length > 0 && (
                    <>
                      <Flex align="center" gap={6} onClick={() => setisShowMenuCheck(!isShowMenuCheck)}>
                        <Text color="secondary">{checkBoxSlected.length} selected</Text>
                        <Icon icon={Menu} style={{ color: "#888686ff", transform: "rotate(90deg)" }} />
                      </Flex>
                      <div style={{ width: 1, height: 24, backgroundColor: "#888686ff" }} />
                    </>
                  )}

                  {isShowMenuCheck && (
                    <div
                      className="side-sort-overlay"
                      onClick={() => setisShowMenuCheck(false)}
                    />
                  )}

                  {isShowMenuCheck && (
                    <Box className="menu-dropdown" >
                      <Flex direction="column" gap={4} align="start" >
                        <Flex direction="column">
                          <Box>
                            <Text type="text2" onClick={() => { setAddTag(!addTag) }} style={{ cursor: "pointer" }} >Add Tag </Text>
                          </Box>

                          {addTag &&
                            <Box marginTop="small">
                              <TextField value={tag} onChange={(value) => setTag(value)} debounceRate={200} />
                              <><Button size="xs" kind="secondary" onClick={addtags} style={{ cursor: "pointer", padding: "5px", marginTop: "5px" }} >Add Tag</Button></>

                            </Box>}

                        </Flex>
                        <Divider />
                        <Text type="text2" onClick={removeTags}>Remove Tag</Text>
                        <Divider />
                        <Text type="text2">Export Selected</Text>
                        <Divider />
                        <Text type="text2">Add Note</Text>
                        <Divider />
                        <Text type="text2">Add To Segments</Text>
                        <Divider />
                        <Text type="text2" style={{ cursor: "pointer" }} onClick={removeTags}>Block User</Text>
                      </Flex>
                    </Box>
                  )}



                  <Flex align="center" gap={6} onClick={() => setIsModalOpen(true)}>
                    <Icon icon={Filter} style={{ color: "#888686ff" }} />
                    <Text color="secondary">Filter</Text>
                  </Flex>

                  <div style={{ width: 1, height: 24, backgroundColor: "#888686ff" }} />

                  <Flex align="center" gap={6} onClick={() => setEditColumns(!editColumns)}>
                    <Icon
                      icon={Baseline}
                      style={{ transform: "rotate(90deg)", color: "#888686ff" }}
                    />
                    <Text color="secondary">Edit Columns</Text>
                  </Flex>

                  <div style={{ width: 1, height: 24, backgroundColor: "#888686ff" }} />

                  <Flex
                    align="center"
                    gap={6}
                    onClick={() => setIsSortDialogue(prev => !prev)}
                    style={{ cursor: "pointer" }}
                  >
                    <Icon icon={Sort} style={{ color: "#888686ff" }} />
                    <Text color="secondary">Sort</Text>
                  </Flex>
                  {isSortDialogue && (
                    <div
                      className="side-sort-overlay"
                      onClick={() => setIsSortDialogue(false)}
                    />
                  )}


                  {isSortDialogue && (
                    <Box className="sort-dropdown"  >
                      <Flex direction="column" gap={10} align="start">
                        <RadioButton text="Newest First" name="sort"
                          checked={isSortBy === 'newest'}
                          onSelect={() => {
                            setIsSortBy('newest'),
                              getStore(shopifyPlan, aePlan, status, days, "newest")
                          }} />
                        <RadioButton text="Oldest First" name="sort" checked={isSortBy === 'oldest'}
                          onSelect={() => { setIsSortBy('oldest'), getStore(shopifyPlan, aePlan, status, days, "oldest") }} />
                        <RadioButton text="Highest Edits" name="sort" checked={isSortBy === 'highest_edits'}
                          onSelect={() => { setIsSortBy('highest_edits'), getStore(shopifyPlan, aePlan, status, days, "highest_edits") }} />
                        <RadioButton text="Lowest Edits" name="sort" checked={isSortBy === 'lowest_edits'}
                          onSelect={() => { setIsSortBy('lowest_edits'), getStore(shopifyPlan, aePlan, status, days, "lowest_edits") }} />
                        <RadioButton text="Higher Revenue" name="sort" checked={isSortBy === 'higher_revenue'}
                          onSelect={() => { setIsSortBy('higher_revenue'), getStore(shopifyPlan, aePlan, status, days, "higher_revenue") }} />
                        <RadioButton text="Lowest Revenue" name="sort" checked={isSortBy === 'lowest_revenue'}
                          onSelect={() => { setIsSortBy('lowest_revenue'), getStore(shopifyPlan, aePlan, status, days, "lowest_revenue") }} />
                      </Flex>
                    </Box >
                  )}

                </>}
              </Flex>

            </Flex>
          </Box>

        </Box>


        {/* TABLE */}
        <Box>
          <Flex gap={10} direction="column" align="end"
          // className="customers-table"
          >
            <Table className="customers-table"
              size={"large"}

              id="customers-table"
              columns={columns}
              // data={pageData}
              dataState={{
                // isLoading:true,
                isEmpty: !isLoading && filteredData?.length === 0,
                isError: false,
              }}
            >

              <TableHeader className="customers-header-cell"
              >



                {columns.map((col, index) => (

                  //  <TableHeaderCell
                  //     className="cos-h-c"
                  //     key={col.id}
                  //     title={col.title}

                  //     icon={editColumns ? Show : null}
                  //   /> 


                  <div className={`${eyeOpen[col.id] ? "cos-h-c-eye" : "cos-h-c"}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    key={col.id}>
                    <p>{col.title}</p>

                    {editColumns && index !== 0 && (
                      <IconButton icon={eyeOpen[col.id] ? Hide : Show}
                        kind="tertiary"
                        onClick={() =>
                          setEyeOpen(prev => ({
                            ...prev,
                            [col.id]: !prev[col.id]
                          }))
                        } />

                    )}



                  </div>



                ))}
              </TableHeader>

              <TableBody >
                {isLoading && (
                  <TableSkeleton
                    rows={8}
                    columns={columns.length}
                    showCheckbox
                  />
                )}
                {pageData.map(row => (
                  <TableRow key={row.storeUrl} className="customers-row">


                    <TableCell className="checkbox-cell" >
                      <div
                        style={{
                          cursor: "pointer", display: "flex",
                          width: "100%", height: "100%", alignItems: "center"
                        }}>

                        <Checkbox checked={checkBoxSlected.includes(row.storeUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''))}
                          onChange={() => toggleArrayValue(setCheckBoxSlected, row.storeUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''))} />
                      </div>
                    </TableCell>


                    <TableCell className={`${eyeOpen.name ? "name-cell-eye" : "name-cell"}`}  >  <div
                      style={{ cursor: "pointer", display: "flex", width: "100%", height: "100%", alignItems: "center" }}
                      onClick={() => {
                        setSelectedDomain(
                          row.storeUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
                        );
                        setUserIfo(true);
                      }}
                    >
                      {row.ownerName}
                    </div></TableCell>
                    <TableCell className={`${eyeOpen.storename ? "name-cell-eye" : "name-cell"}`}>{row.storeName}</TableCell>
                    <TableCell className={`name-cell ${eyeOpen.storename ? "name-cell-eye" : ""}`}>{row.storeUrl}</TableCell>
                    <TableCell className={`${eyeOpen.shopifyplan ? "name-cell-eye" : "name-cell"}`}>
                      <Flex gap={5}>

                        <Icon iconType='src' icon='src/assets/Images/ShopifyIm.svg' />
                        {row.shopifyPlan}
                      </Flex>
                    </TableCell>
                    <TableCell className={`${eyeOpen.aeplan ? "name-cell-eye" : "name-cell"}`}>
                      <Flex gap={5}>

                        <Icon iconType="src" icon={Vector} />
                        {row.AEplan}
                      </Flex>
                    </TableCell >

                    <TableCell className={`${eyeOpen.name ? "name-cell-eye" : "name-cell"}`}>
                      <Chips label={row.status}


                        color={statusColorMap[row.status]} readOnly
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box>
              <Flex align="end" justify="center" gap={10} >
                <Steps
                  id="overview-steps"
                  steps={steps.map((t) => (
                    <div />
                  ))}
                  // steps={steps}

                  activeStepIndex={page - 1}

                  backButtonProps={{
                    disabled: page === 1,
                    onClick: () => setPage(p => Math.max(1, p - 1))
                  }}

                  nextButtonProps={{
                    disabled: page === totalPages,
                    onClick: () => setPage(p => Math.min(totalPages, p + 1))
                  }}

                  onChangeActiveStep={(index) => {
                    setPage(index + 1);
                  }}

                // onFinish={() => {
                //   console.log("Reached last page");
                // }}
                />
              </Flex>
            </Box>
          </Flex>
        </Box>

        {/* Filter Modal */}

        {isModalOpen && (
          <div
            className="side-filter-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <FilterCustomer
          setTags={setTags}
          tags={tags}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          aePlan={aePlan}
          shopifyPlan={shopifyPlan}
          status={status}
          days={days}
          orders={orders}
          setOrders={setOrders}
          setAePlan={setAePlan}
          setShopifyPlan={setShopifyPlan}
          setStatus={setStatus}
          setDays={setDays}
          getStore={getStore}
          handleClearall={handleClearall}
          toggleArrayValue={toggleArrayValue}
        />


        {/* View ProfileModal */}
        {userInfo && (
          <div
            className="side-filter-overlay"
            onClick={() => setUserIfo(false)}
          />
        )}



        <CustomerTogInfo
          setSelectedDomain={setSelectedDomain}
          selectedDomain={selectedDomain}
          setUserIfo={setUserIfo}
          userInfo={userInfo}
        />

      </Box>
      {/* </Flex> */}

      {showToast && (
        <Toast
          id="global-error-toast"
          open={showToast.open}
          type={showToast.type}
          onClose={() => setShowToast({ ...showToast, open: false })}
          actions={[
            {
              type: "button",
              content: "Ok",
              onClick: () =>
                setShowToast({ ...showToast, open: false }),
            },
          ]}
        >
          {showToast.message}
        </Toast>
      )}
    </Box>
  );
}
