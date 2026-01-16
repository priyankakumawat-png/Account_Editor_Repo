import {
  Box,
  Flex,
  Button,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Text,
  Chips,
  Heading,
  IconButton,
  AttentionBox,
  AlertBanner,
  AlertBannerText,
  Toast
} from "@vibe/core";
import { Add, Delete } from "@vibe/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TableSkeleton from "../Common/TableSkeleton";


const tableHeaders = [
  { id: "emailName", title: "Email Name" },
  { id: "trigger", title: "Trigger" },
  { id: "status", title: "Status" },
  { id: "delay", title: "Delay" },
  { id: "lastEdition", title: "Last Edition" },
  { id: "actions", title: "Actions" },
];


export default function EmailCenter() {
  const navigate = useNavigate()
  const [emailData, setEmailData] = useState([])
  const[isLoading , setIsLoading ] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const token =
    "bW9oaXQtc2luZ2gtZGV2Lm15c2hvcGlmeS5jb20xfGpCT2NVUjN2MG9WR1ppWVBqMEpBNWlra3BISjM2amxXWkZVN2VXU3o=";

  useEffect(() => {
    const getEmailList = async () => {
      setIsLoading(true)
      try {
        const res = await axios.post(
          "https://account-editor-stage.fly.dev/api/admin/template/list",
          {
            // page: 1,
            // limit: 9,
            // search: "plate",
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
              shop: "mohit-singh-dev.myshopify.com",
            },
          }
        );

        setEmailData(res.data.result.data)

        console.log("API RESPONSE 👉", res.data.result);
      } catch (error) {
        console.error("API ERROR 👉", error.response?.data || error.message);
      }
      finally{
        setIsLoading(false)
      }
    };

    getEmailList();
  }, []);

  // const deleteEmail = async (id) => {
  //   try {
  //     const res = await axios.post(
  //       "https://account-editor-stage.fly.dev/api/admin/template/delete",
  //       { id },
  //       {
  //         headers: {
  //           authorization: `Bearer ${token}`,
  //           shop: "mohit-singh-dev.myshopify.com",
  //         },
  //       }
  //     );

  //     console.log("Deleted:", res.data);

  //     // UI se remove
  //     setEmailData(prev =>
  //       prev.filter(email => email._id !== id)
  //     );

  //   } catch (error) {
  //     console.log(
  //       "Error in delete API:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };




  const deleteEmail = async (id) => {
  const previousData = emailData;

  // instant remove
  setEmailData((prev) =>
    prev.filter((email) => email._id !== id)
  );

  try {
    await axios.post(
      "https://account-editor-stage.fly.dev/api/admin/template/delete",
      { id },
      {
        headers: {
          authorization: `Bearer ${token}`,
          shop: "mohit-singh-dev.myshopify.com",
        },
      }
    );
  } catch (err) {
    setEmailData(previousData); // rollback
    alert("Delete failed");
  }
};

  return (
    <Box >

      {/* HEADER */}
      <Flex
        //  align="center" 
        justify="space-between" style={{ marginBottom: "16px" }}>
        <Heading type="h3">Email Center</Heading>

        <Button size="small" leftIcon={Add} onClick={() => navigate('/createnewemail')}>
          Create Email
        </Button>
      </Flex>

      {/* TABLE */}
      <Table size="large" columns={tableHeaders}>
        <TableHeader>
          {tableHeaders.map((header) => (
            <TableHeaderCell
              key={header.id}
              title={header.title}
            />
          ))}
        </TableHeader>


        <TableBody >

          {isLoading &&(
            <TableSkeleton
      rows={8}
      columns={tableHeaders.length}
      showCheckbox
    />
          )}
          {/* ROW 1 */}
          {emailData.map((data) => (

            <TableRow>
              <TableCell> {data.templateName} </TableCell>
              <TableCell>
                {data.type}
              </TableCell>
              <TableCell>
                <Chips label={data.status === true ? "Enabled" : 'Disabled'} color={data.status === true ? '#B5CEC0' : "#C3C6D4 "} readOnly />
              </TableCell>
              <TableCell>
                {data.timeFrame.time} {data.timeFrame.type}
              </TableCell>
              <TableCell>
                <Text>
                  {Math.floor(
                    (Date.now() - new Date(data.updatedAt)) / (1000 * 60 * 60)
                  )}{" "}
                  hours ago
                </Text>            </TableCell>
              <TableCell>
                <Flex gap={5}>
                  <Button size="small" kind="tertiary" onClick={() => navigate(`/updateemail/${data._id}`, {
                    state: { emailData: data }
                  })}>
                    Edit
                  </Button>
                  <IconButton
                    icon={Delete}
                    onClick={() => {
                      setSelectedId(data._id);
                      setShowDeleteConfirm(true);
                    }}
                  />


                </Flex>
              </TableCell>
            </TableRow>
          ))}

          {/* ROW 2 */}

        </TableBody>
      </Table>
      {showDeleteConfirm && (
  <Toast
    id="delete-confirm-toast"
    open
    type="negative"
    onClose={() => setShowDeleteConfirm(false)}
    actions={[
      {
        type: "button",
        content: "Delete",
        onClick: () => {
          deleteEmail(selectedId);
          setShowDeleteConfirm(false);
        },
      },
      {
        type: "button",
        content: "Cancel",
        onClick: () => setShowDeleteConfirm(false),
      },
    ]}
  >
    Are you sure you want to delete this data?
  </Toast>
)}

    </Box>
  );
}
