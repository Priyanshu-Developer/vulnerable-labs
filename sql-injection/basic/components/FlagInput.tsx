"use client";
import { Card,CardHeader,CardBody,Button,Input, ToastProvider, addToast } from "@heroui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import LabCompleteGreeting from "./LabCompleteGreeting";


interface FlagInputProps {
  flag: string ;
  setFlag: React.Dispatch<React.SetStateAction<string>>;
  nextLabLink: string;
  labid: string;
}

const FlagInput :React.FC<FlagInputProps> = ({ flag, setFlag, nextLabLink, labid }) => {
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const checkFlag = async() => {
    try {
      const res = await fetch(`/api/checkFlag?flag=${encodeURIComponent(flag)}&labid=${encodeURIComponent(labid)}`);
      const data = await res.json();
      if (data.success) {
        addToast({
          title: "Correct Flag",
          description: "Congratulations! You've entered the correct flag.",
          color: "success",
          timeout: 5000,
          variant: "bordered",
        });
        setFlag("");
        setIsCompleteOpen(true);
      } else {
        addToast({
          title: "Incorrect Flag",
          description: "The flag you entered is incorrect. Please try again.",
          color: "danger",
          timeout: 5000,
          variant: "bordered",
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "An error occurred while checking the flag. Please try again.",
        color: "danger",
        timeout: 5000,
        variant: "bordered",
      });
    }
  }
  return (
     <div className="relative z-30 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="terminal-intro absolute top-0 -right-100 z-30 w-full max-w-3xl -translate-x-1/2 px-4 text-center pointer-events-auto"
        >
          <Card className="terminal-card">
            <CardHeader className=" text-amber-50">
              Please Enter Your Flag
            </CardHeader>
            <CardBody className=" flex flex-row items-center justify-center gap-1.5 ">
              <Input
                variant="bordered"
                label="Flag"
                placeholder="Flag{example_flag}"
                value={flag}
                onValueChange={setFlag}
                classNames={{
                  inputWrapper: "lab-input-wrap",
                  input: "lab-input",
                  label: "lab-input-label",
                }}
              />
              <Button
                color="success"
                radius="sm"
                className="cta-primary "
                onPress={() => checkFlag()}
              >
                Submit
              </Button>
            </CardBody>
          </Card>
        </motion.div>
        <ToastProvider placement="top-center"/>
        <LabCompleteGreeting isOpen={isCompleteOpen}  onOpenChange={setIsCompleteOpen} nextLabLink={nextLabLink}/>
      </div>
  );

}
export default FlagInput;