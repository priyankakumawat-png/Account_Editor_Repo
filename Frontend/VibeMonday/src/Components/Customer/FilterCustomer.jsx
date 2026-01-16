import { Box, Button, Checkbox, Chips, Divider, Dropdown, Flex, ModalContent, ModalFooter, Text, TextField } from '@vibe/core';
import { CloseSmall } from '@vibe/icons';
import React, { useState } from 'react'

const FilterCustomer = ({ aePlan,
    shopifyPlan,
    status,
    days,
    setAePlan,
    setShopifyPlan,
    setStatus,
    setDays,
    setIsModalOpen,
    isModalOpen,
    tags,
    setTags,
    getStore,
    setOrders,
    orders,
    handleClearall,
    toggleArrayValue
}) => {

    // const toggleArrayValue = (setFn, value) => {
    //     setFn((prev) =>
    //         prev.includes(value)
    //             ? prev.filter((item) => item !== value)
    //             : [...prev, value]
    //     );
    // };


    const handleRangeChange = (setFn, type, value) => {
        setFn(prev => ({
            ...prev,
            [type]: value,
        }));
    };


   

    // const handleClearall = () => {
    //     setAePlan([])
    //     setShopifyPlan([])
    //     setStatus([])
    //     setSegments([])
    //     setDays({ min: '', max: '' })
    //     setOrders({ min: '', max: '' })
    // }


    return (
        <div>

            <Box>
                <Box
                    className={`side-filter-panel ${isModalOpen ? "open" : ""}`}
                >

                    <Box padding="medium" borderBottom="1px solid #e6e6e6" className="header">
                        <Flex align="center" justify="space-between">
                            <Text type="text1" weight="bold">Filter</Text>

                            <Flex gap={8}>
                                <Button size="xs" kind="primary" >
                                    Add To Preset
                                </Button>

                                <Button
                                    size="small"
                                    kind="tertiary"
                                    onClick={() => setIsModalOpen(false)}
                                    rightIcon={CloseSmall}
                                >

                                </Button>
                            </Flex>
                        </Flex>
                    </Box>

                    <ModalContent className="content" >
                        <Box>
                            <Flex direction="column" gap={5} align="start">

                                <Box>
                                    <Text type="text1" weight="bold">
                                        Plan
                                    </Text>
                                </Box>



                                <Box>
                                    <Flex gap={10}>
                                        {["Trail", "Bronze", "Gold", "Silver", "Custom"].map((item) => (
                                            <Checkbox
                                                key={item}
                                                label={item}
                                                checked={aePlan.includes(item)}
                                                onChange={() => toggleArrayValue(setAePlan, item)}
                                            />
                                        ))}
                                    </Flex>
                                </Box>

                                <Divider />
                            </Flex>

                        </Box>

                        <Box>
                            <Flex direction="column" gap={5} align="start">

                                <Box>
                                    <Text type="text1" weight="bold">
                                        Shopify Plan
                                    </Text>
                                </Box>


                                <Box>
                                    <Flex gap={10}>
                                        {["Basic", "Grow", "Advance", "Plus"].map((item) => (
                                            < Checkbox
                                                key={item}
                                                label={item}
                                                checked={shopifyPlan.includes(item)}
                                                onChange={() => toggleArrayValue(setShopifyPlan, item)}
                                            />

                                        ))}
                                    </Flex>
                                </Box>


                                <Divider />
                            </Flex>

                        </Box>

                        <Box>
                            <Flex direction="column" gap={5} align="start">

                                <Box>
                                    <Text type="text1" weight="bold">
                                        Status
                                    </Text>
                                </Box>


                                <Box>
                                    <Flex gap={10}>
                                        {["Active", "Trial", "Uninstall"].map((item) => (
                                            < Checkbox
                                                key={item}
                                                label={item}
                                                checked={status.includes(item)}
                                                onChange={() => toggleArrayValue(setStatus, item)}
                                            />

                                        ))}

                                    </Flex>
                                </Box>


                                <Divider />
                            </Flex>

                        </Box>



                        <Box>
                            <Flex direction="column" gap={5}
                                align="start"
                            >

                                <Box>
                                    <Text type="text1" weight="bold">
                                        Tags
                                    </Text>
                                </Box>


                                <Box style={{ width: "100%" }} >
                                    <Flex justify="space-between" >
                                        <Box style={{ width: "75%", display: "flex", flexWrap: "wrap", gap: "8px" }} >
                                            {tags.map((tg) => {
                                                const [isChipSlected, setisChipSlected] = useState(false)

                                                return (

                                                    <Chips label={tg} readOnly rightIcon={isChipSlected ? Check : null} onClick={() => setisChipSlected(!isChipSlected)} />
                                                )
                                            })}
                                        </Box>




                                    </Flex>

                                </Box>


                                <Divider />
                            </Flex>

                        </Box>


                        <Box>
                            <Flex direction="column" gap={5} align="start">

                                <Box>
                                    <Text type="text1" weight="bold">
                                        Country
                                    </Text>
                                </Box>


                                <Box>
                                    <Flex gap={0}>
                                        <Box style={{ width: "300px" }}>

                                            <Dropdown placeholder="Search an item" searchable clearAriaLabel="Clear" />
                                        </Box>

                                    </Flex>
                                </Box>


                                <Divider />
                            </Flex>
                        </Box>




                        {/* <Box>
                <Flex direction="column" gap={5} align="start">

                  <Box>
                    <Text type="text1" weight="bold">
                      Segments
                    </Text>
                  </Box>


                  <Box>
                    <Flex gap={10}>
                      {["High Edits", "Heavy UpSell", "Churn Watch"].map((item) => (
                        < Checkbox
                          key={item}
                          label={item}
                          checked={segments.includes(item)}
                          onChange={() => toggleArrayValue(setSegments, item)}
                        />

                      ))}

                    </Flex>
                  </Box>


                  <Divider />
                </Flex>

              </Box> */}



                        <Box>
                            <Flex direction="column" gap={5} align="start">

                                <Box>
                                    <Text type="text1" weight="bold">
                                        Number of Days
                                    </Text>
                                </Box>


                                <Box>
                                    <Flex gap={5}>
                                        <Box style={{ display: "inline-flex", border: "1px solid #ccc", borderRadius: "6px", overflow: "hidden", fontFamily: "sans-serif" }}>
                                            <TextField

                                                placeholder="Min Days"
                                                size="small"
                                                type="number"
                                                value={days.min}
                                                onChange={(value) => handleRangeChange( setDays , "min", value)}

                                            />
                                            <Text type="text2" style={{
                                                backgroundColor: "#d1d5db", // grey like screenshot
                                                // padding: "8px 12px",
                                                // fontSize: "12px",
                                                // fontWeight: "500",
                                                // color: "#111",
                                                display: "flex",
                                                alignItems: "center"
                                            }}>Min Days</Text>

                                        </Box>

                                        <Box style={{ display: "inline-flex", border: "1px solid #ccc", borderRadius: "6px", overflow: "hidden", fontFamily: "sans-serif" }}>
                                            <TextField id="sizes-small"
                                                placeholder="Max Days"
                                                size="small"
                                                type="number"
                                                value={days.max}
                                                onChange={(value) => handleRangeChange( setDays, "max", value)}
                                                style={{
                                                    width: "60px",
                                                    // padding: "8px",
                                                    border: "none",
                                                    borderRadius: "0",
                                                    outline: "none",
                                                    textAlign: "center"
                                                }}
                                            />
                                            <Text type="text2" style={{
                                                backgroundColor: "#d1d5db", // grey like screenshot
                                                // padding: "8px 12px",
                                                // fontSize: "14px",
                                                // fontWeight: "500",
                                                // color: "#111",
                                                display: "flex",
                                                alignItems: "center"
                                            }}>Max Days</Text>
                                        </Box>



                                    </Flex>

                                </Box>

                                <Divider />

                            </Flex>

                        </Box>

                        <Box>
                            <Flex direction="column" gap={5} align="start">

                                <Box>
                                    <Text type="text1" weight="bold">
                                        Number of Order
                                    </Text>
                                </Box>


                                <Box>
                                    <Flex gap={5}>
                                        <Box style={{ display: "inline-flex", border: "1px solid #ccc", borderRadius: "6px", overflow: "hidden", fontFamily: "sans-serif" }}>
                                            <TextField

                                                placeholder="Min Order"
                                                size="small"
                                                type="number"
                                                value={orders.min}
                                                onChange={(value) =>
                                                    handleRangeChange(setOrders, "min", value)
                                                }

                                            />
                                            <Text type="text2" style={{
                                                backgroundColor: "#d1d5db", // grey like screenshot
                                                // padding: "8px 12px",
                                                // fontSize: "12px",
                                                // fontWeight: "500",
                                                // color: "#111",
                                                display: "flex",
                                                alignItems: "center"
                                            }}>Min Ord.</Text>

                                        </Box>

                                        <Box style={{ display: "inline-flex", border: "1px solid #ccc", borderRadius: "6px", overflow: "hidden", fontFamily: "sans-serif" }}>
                                            <TextField id="sizes-small"
                                                placeholder="Max Order"
                                                size="small"
                                                type="number"
                                                value={orders.max}
                                                onChange={(value) =>
                                                    handleRangeChange(setOrders, "max", value)
                                                }
                                                style={{
                                                    // width: "30px",
                                                    // padding: "8px",
                                                    border: "none",
                                                    borderRadius: "0",
                                                    outline: "none",
                                                    textAlign: "center"
                                                }}
                                            />
                                            <Text type="text2" style={{
                                                backgroundColor: "#d1d5db", // grey like screenshot
                                                // padding: "8px 12px",
                                                // fontSize: "14px",
                                                // fontWeight: "500",
                                                // color: "#111",
                                                display: "flex",
                                                alignItems: "center"
                                            }}>Max Ord.</Text>
                                        </Box>



                                    </Flex>

                                </Box>


                            </Flex>

                        </Box>


                    </ModalContent>

                    <ModalFooter className="footer">
                        <Flex gap={5} justify="end">
                            <Button kind="secondary" onClick={() => {
                                setIsModalOpen(false);
                                handleClearall();
                                getStore();

                            }}>Clear</Button>
                            <Button type="primary" onClick={() => {
                                setIsModalOpen(false);
                                getStore(shopifyPlan, aePlan, status, days)
                            }}>Apply</Button>
                        </Flex>
                    </ModalFooter>
                </Box>
            </Box>
        </div>
    )
}

export default FilterCustomer