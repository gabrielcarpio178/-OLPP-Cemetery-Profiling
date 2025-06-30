import * as React from "react";
import { Toast } from "radix-ui";
import { FaCheckCircle } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import "./styles.css";

interface alertSuccess {
    isOpen: boolean;
    message: string;
}

export const AlertSuccess:React.FC<alertSuccess> = ({isOpen, message}) => {


	return (
		<Toast.Provider swipeDirection="right">
			<Toast.Root className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded shadow-md font-sans ToastRoot" open={isOpen} >
				<Toast.Title className="ToastTitle">
                    <div className="flex flex-row items-center justify-between">
                        <div>
                            {message}
                        </div>
                        <IconContext.Provider value={{ size: `1.5em` }}>
                            <FaCheckCircle className="text-green-600" />
                        </IconContext.Provider>
                    </div>
                </Toast.Title>
			</Toast.Root>
			<Toast.Viewport className="ToastViewport" />
		</Toast.Provider>
	);
};



