import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./Search.scss";
import { Container, Row, Col, Button } from "react-bootstrap";
// import
import CustomDropdown from "@/components/CustomDropdown/CustomDropdown";
import { MainApiRequest } from "@/services/MainApiRequest";
import { useNavigate, useNavigation } from "react-router-dom";
import moment from "moment";

const Search = ({
  tierList,
  startDateInp = moment().toDate(),
  endDateInp = moment().add(5, 'days').toDate()
}: {
  tierList: any[];
  startDateInp?: Date;
  endDateInp?: Date;
}) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(startDateInp || moment().toDate());
  const [endDate, setEndDate] = useState(endDateInp || moment().add(5, 'days').toDate());
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<number | null>(null);

  const onSelectedTier = (value: any) => {
    const tier = tierList.find((item) => item.name === value);
    setSelectedTier(tier?.id);
  }

  const onSelectedGuest = (value: any) => {
    setSelectedGuest(parseInt(value));
  }

  const onSearch = async () => {
    // if (!selectedTier && !selectedGuest) {
    //   alert("Please select Tier or Guest");
    //   return;
    // }

    navigate("/rooms", {
      state: {
        tier: selectedTier,
        guest: selectedGuest,
        startDate: startDate,
        endDate: endDate
      }
    })
  }

  return (
    <>
      <section className="box-search-advance">
        <Container>
          <Row>
            <Col md={12} xs={12}>
              <div className="box-search shadow-sm">
                <div className="item-search">
                  {/*  Using Props to Pass Data */}
                  <CustomDropdown
                    label="Tier"
                    onSelect={onSelectedTier}
                    options={tierList.map((item) => item.name)}
                  />
                </div>
                <div className="item-search item-search-2">
                  <label className="item-search-label"> Check in </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date || new Date())}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}

                    dateFormat="dd, MMMM, yyyy"
                  />
                </div>
                <div className="item-search item-search-2">
                  <label className="item-search-label"> Check Out </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date || new Date())}
                    selectsEnd
                    startDate={endDate}
                    endDate={startDate}
                    dateFormat="dd, MMMM, yyyy"
                  />
                </div>
                <div className="item-search bd-none">
                  <CustomDropdown
                    label="Guest"
                    onSelect={onSelectedGuest}
                    options={[
                      1,
                      2,
                      3,
                      4,
                      5,
                      6
                    ].map((item) => item.toString())}
                  />
                </div>
                <div className="item-search bd-none">
                  <Button className="primaryBtn flex-even d-flex justify-content-center" onClick={onSearch}>
                    <i className="bi bi-search me-2"></i> Search
                  </Button>

                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Search;