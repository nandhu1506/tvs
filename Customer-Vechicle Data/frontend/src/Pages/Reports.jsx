import React, { useState } from "react";
import CustomerReport from "./CustomerReport";
import VehicleReport from "./VehicleReport";
import { Button, Container, ButtonGroup, Card } from "react-bootstrap";
import NavBar from "../components/NavBar";
import VehicleByCustomerReport from "./VehicleByCustomerReport";

export default function Reports() {
  const [activeReport, setActiveReport] = useState("customers");

  return (
    <>
      <NavBar />
      <Container className="mt-5">
        <Card className="shadow-sm p-3">
          <h2 className="mb-4 text-center" style={{ color: "#0d6efd", fontWeight: "700" }}>
            Reports
          </h2>

          <ButtonGroup className="mb-4 w-100 d-flex justify-content-center gap-2 flex-wrap">
            <Button
              variant={activeReport === "customers" ? "primary" : "outline-primary"}
              onClick={() => setActiveReport("customers")}
            >
              Customer Report
            </Button>

            <Button
              variant={activeReport === "vehicles" ? "primary" : "outline-primary"}
              onClick={() => setActiveReport("vehicles")}
            >
              Vehicle Report
            </Button>

            <Button
              variant={activeReport === "vehicleByCustomer" ? "primary" : "outline-primary"}
              onClick={() => setActiveReport("vehicleByCustomer")}
            >
              Vehicle By Customer
            </Button>
          </ButtonGroup>

          <div>
            {activeReport === "customers" && <CustomerReport />}
            {activeReport === "vehicles" && <VehicleReport />}
            {activeReport === "vehicleByCustomer" && <VehicleByCustomerReport />}
          </div>
        </Card>
      </Container>
    </>
  );
}