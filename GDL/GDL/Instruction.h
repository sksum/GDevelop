/**
 *  Game Develop
 *  2008-2010 Florian Rival (Florian.Rival@gmail.com)
 */

#ifndef INSTRUCTION_H
#define INSTRUCTION_H
#include <string>
#include <vector>
#include <iostream>
class RuntimeScene;
class Evaluateur;
class ObjectsConcerned;
class Object;
class Automatism;
#include "GDL/GDExpression.h"

using namespace std;

/**
 * An instruction is a member of an event. It can be a condition or an action.
 * Instructions have a type, which is used to link the Instruction to a function
 */
class GD_API Instruction
{
    public:

        Instruction(string type_ = "");
        Instruction(string type_, const vector <GDExpression> & parameters_, bool isLocal = true , bool pContraire = false);
        virtual ~Instruction();

        typedef bool (*ptrFunction)( RuntimeScene & scene, ObjectsConcerned & objectsConcerned, const Instruction & instruction );
        ptrFunction function; ///<Main function to be called.

        typedef bool (Object::*ptrObjectFunction)( RuntimeScene & scene, ObjectsConcerned & objectsConcerned, const Instruction & instruction );
        ptrObjectFunction objectFunction; ///<Function to call on each object, if the instruction need one.

        unsigned int automatismTypeId; ///<Automatism type to call, if the instruction need one
        typedef bool (Automatism::*ptrAutomatismFunction)( RuntimeScene & scene, ObjectsConcerned & objectsConcerned, const Instruction & instruction );
        ptrAutomatismFunction automatismFunction; ///<Function to call on each object automatism, if the instruction need one.

        /** Access type
         * \return The type of the instruction
         */
        string GetType() const { return type; }

        /** Set type
         * \param val New value to set
         */
        void SetType(string val) { type = val; }

        /** Access objectFunctionType
         * \return The objectFunctionType of the instruction
         */
        inline string GetObjectFunctionType() const { return objectFunctionType; }

        /** Set objectFunctionType
         * \param val New value to set
         */
        inline void SetObjectFunctionType(string val) { objectFunctionType = val; }

        /** Is the instruction local ( default ) ?
         * \return true if instruction is local
         */
        bool IsLocal() const { return isLocal; }

        /** Is the instruction global ?
         * \return true if instruction is global
         */
        bool IsGlobal() const { return !isLocal; }

        /** Set the instruction local ( default ) or not.
         * \param val New value to set
         */
        void SetLocal(bool val) { isLocal = val; }

        /** Is the instruction inverted ?
         * \return The current value of contraire
         */
        bool IsInverted() const { return inverted; }

        /** Set if the instruction is inverted or not.
         * \param val New value to set
         */
        void SetInversion(bool val) { inverted = val; }

        /** Access parameters
         * \return A vector of string containing parameters
         */
        inline const vector < GDExpression > & GetParameters() const { return parameters; }

        /** Access a parameter
         * \return The current value of the parameter
         */
        inline GDExpression & GetParameter(unsigned int nb) const
        {
            if ( nb >= parameters.size() )
            {
                #ifndef RELEASE
                    std::cout << "Parameter that doesn't exist was requested.";
                #endif
                return badExpression;
            }

            return parameters[nb];
        }

        /** Set parameters
         * \param val A vector of string containing the parameters
         */
        inline void SetParameters(const vector < GDExpression > & val) { parameters = val; }

        /** Set parameter
         * \param nb The parameter number
         * \param val The new value of the parameter
         */
        void SetParameter(unsigned int nb, const GDExpression & val);

        inline const vector < Instruction > & GetSubInstructions() const { return subInstructions; };
        inline vector < Instruction > & GetSubInstructions() { return subInstructions; };
        inline void SetSubInstructions(const vector < Instruction > & subInstructions_) { subInstructions = subInstructions_; };

        #if defined(GDE)
        mutable bool renderedHeightNeedUpdate;
        mutable unsigned int renderedHeight; ///<Height of the instruction rendered in an event editor
        mutable bool selected; ///<True if selected in an event editor
        #endif

        /**
         * Serialize
         */
        template<class Archive>
        void serialize(Archive& ar, const unsigned int version){
            ar  & BOOST_SERIALIZATION_NVP(type)
                & BOOST_SERIALIZATION_NVP(objectFunctionType)
                & BOOST_SERIALIZATION_NVP(isLocal)
                & BOOST_SERIALIZATION_NVP(inverted)
                & BOOST_SERIALIZATION_NVP(parameters)
                & BOOST_SERIALIZATION_NVP(subInstructions);
        }

    private:
        string type;
        string objectFunctionType;
        bool isLocal;
        bool inverted;
        mutable vector < GDExpression > parameters;

        vector < Instruction > subInstructions;

        static GDExpression badExpression;
};

#endif // INSTRUCTION_H
